import type { AppThunk } from '@/store';
import { createCrudApiQueueItems } from '@/api/crud-api-generation-queue';
import type { CreateCrudApiQueueItemInput } from '@/model/crud-api-generation-queue';
import { CrudApiQueueActions } from '@/store/dumps/crudApiGenerationQueue';
import { CrudApiBuilderActions } from '@/store/builders/crudApiBuilder';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const createCrudApiQueueItemsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const state = getState();
      const currentProject = state.currentProject;
      const selectedEntityIds = state.crudApiBuilder.selectedEntityIds;
      const entityOperationSelections = state.crudApiBuilder.entityOperationSelections;
      const crudApiTasks = state.crudApiTasks;
      const dataEntities = state.dataEntities;

      if (!currentProject?.id) {
        console.error('❌ No current project');
        return 400;
      }

      // Build queue items: one per operation (file-based)
      const items: CreateCrudApiQueueItemInput[] = [];

      for (const entityId of selectedEntityIds) {
        const entity = dataEntities.find((e) => e.id === entityId);
        if (!entity || !entity.assigned_repo_ids || entity.assigned_repo_ids.length === 0) {
          console.error(`❌ Entity ${entityId} not found or has no assigned repos`);
          continue;
        }

        const selectedOps = entityOperationSelections[entityId] || [];
        const entitySlug = (entity.name || '').toLowerCase().replace(/\s+/g, '-');
        const repoId = entity.assigned_repo_ids[0]; // Use first assigned repo

        // Create one queue item per operation
        for (const opKey of selectedOps) {
          const task = crudApiTasks.find((t) => t.operation_key === opKey);
          if (!task) {
            console.error(`❌ No task found for operation: ${opKey}`);
            continue;
          }

          // Build file path from template
          const filePath = task.output_path_template.replace('{{entity_slug}}', entitySlug);

          items.push({
            project_id: currentProject.id,
            repo_id: repoId,
            entity_id: entityId,
            task_id: task.id,
            operation_key: opKey,
            file_path: filePath,
          });
        }
      }

      if (items.length === 0) {
        console.error('❌ No queue items to create');
        return 400;
      }

      console.log(`📥 Creating ${items.length} queue items (one per file)`);
      const result = await createCrudApiQueueItems(items, getApiBaseUrl());

      if (result.success && result.data) {
        dispatch(CrudApiQueueActions.addCrudApiQueueItems(result.data));
        dispatch(CrudApiBuilderActions.clearSelections());
        console.log(`✅ Successfully created ${result.data.length} queue items`);
        return 200;
      }

      console.error('❌ Failed to create queue items:', result.error);
      return 400;
    } catch (error) {
      console.error('❌ Error in createCrudApiQueueItemsThunk:', error);
      return 500;
    }
  };
};

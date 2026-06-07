import { combineReducers } from '@reduxjs/toolkit';
import {
  projectsReducer,
  projectReposReducer,
  dataEntitiesReducer,
  buildConventionsReducer,
  buildExamplesReducer,
  ardTasksReducer,
  ardGenerationQueueReducer,
  dataModelGenerationQueueReducer,
  crudApiGenerationQueueReducer,
  crudApiTasksSlice,
  buildStepsReducer,
  taskCategoriesReducer,
  stepTaskCategoriesReducer,
  conventionTaskCategoriesReducer,
  cursorGenerationExchangesReducer,
} from './dumps';
import { currentProjectReducer, currentBuildStepReducer, currentTaskCategoryReducer } from './current';
import {
  workspaceBuilderReducer,
  buildFoundationBuilderReducer,
  crudApiBuilderReducer,
  dataModelBuilderReducer,
  layoutBuilderReducer,
  buildStepBuilderReducer,
  taskCategoryBuilderReducer,
} from './builders';

const rootReducer = combineReducers({
  projects: projectsReducer,
  projectRepos: projectReposReducer,
  dataEntities: dataEntitiesReducer,
  buildConventions: buildConventionsReducer,
  buildExamples: buildExamplesReducer,
  ardTasks: ardTasksReducer,
  ardGenerationQueue: ardGenerationQueueReducer,
  dataModelGenerationQueue: dataModelGenerationQueueReducer,
  crudApiGenerationQueue: crudApiGenerationQueueReducer,
  crudApiTasks: crudApiTasksSlice.reducer,
  buildSteps: buildStepsReducer,
  taskCategories: taskCategoriesReducer,
  stepTaskCategories: stepTaskCategoriesReducer,
  conventionTaskCategories: conventionTaskCategoriesReducer,
  cursorGenerationExchanges: cursorGenerationExchangesReducer,
  currentProject: currentProjectReducer,
  workspaceBuilder: workspaceBuilderReducer,
  buildFoundationBuilder: buildFoundationBuilderReducer,
  crudApiBuilder: crudApiBuilderReducer,
  dataModelBuilder: dataModelBuilderReducer,
  layoutBuilder: layoutBuilderReducer,
  buildStepBuilder: buildStepBuilderReducer,
  taskCategoryBuilder: taskCategoryBuilderReducer,
  currentBuildStep: currentBuildStepReducer,
  currentTaskCategory: currentTaskCategoryReducer,
});

export default rootReducer;

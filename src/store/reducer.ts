import { combineReducers } from '@reduxjs/toolkit';
import {
  customersReducer,
  softwareSystemsReducer,
  softwareSystemReposReducer,
  conventionsReducer,
  conventionOptionsReducer,
  conventionVocabularyReducer,
  conventionSnapshotsReducer,
} from './dumps';
import {
  currentCustomerReducer,
  currentSoftwareSystemReducer,
  currentConventionReducer,
} from './current';
import {
  workspaceBuilderReducer,
  layoutBuilderReducer,
  customerBuilderReducer,
  repositoriesBuilderReducer,
  studioStackBuilderReducer,
  customerOpsSyncBuilderReducer,
  conventionBuilderReducer,
  aiContextBuilderReducer,
} from './builders';

export const rootReducer = combineReducers({
  customers: customersReducer,
  softwareSystems: softwareSystemsReducer,
  softwareSystemRepos: softwareSystemReposReducer,
  currentCustomer: currentCustomerReducer,
  currentSoftwareSystem: currentSoftwareSystemReducer,
  workspaceBuilder: workspaceBuilderReducer,
  layoutBuilder: layoutBuilderReducer,
  customerBuilder: customerBuilderReducer,
  repositoriesBuilder: repositoriesBuilderReducer,
  studioStackBuilder: studioStackBuilderReducer,
  customerOpsSyncBuilder: customerOpsSyncBuilderReducer,
  conventions: conventionsReducer,
  conventionOptions: conventionOptionsReducer,
  conventionVocabulary: conventionVocabularyReducer,
  conventionSnapshots: conventionSnapshotsReducer,
  currentConvention: currentConventionReducer,
  conventionBuilder: conventionBuilderReducer,
  aiContextBuilder: aiContextBuilderReducer,
});

import { combineReducers } from '@reduxjs/toolkit';
import {
  customersReducer,
  softwareSystemsReducer,
  softwareSystemReposReducer,
} from './dumps';
import {
  currentCustomerReducer,
  currentSoftwareSystemReducer,
} from './current';
import {
  workspaceBuilderReducer,
  layoutBuilderReducer,
  customerBuilderReducer,
  repositoriesBuilderReducer,
  studioStackBuilderReducer,
  customerOpsSyncBuilderReducer,
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
});

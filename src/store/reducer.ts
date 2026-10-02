import { combineReducers } from '@reduxjs/toolkit';
import {
  customersReducer,
  projectsReducer,
  projectReposReducer,
} from './dumps';
import {
  currentCustomerReducer,
  currentProjectReducer,
} from './current';
import {
  workspaceBuilderReducer,
  layoutBuilderReducer,
  customerBuilderReducer,
  repositoriesBuilderReducer,
} from './builders';

export const rootReducer = combineReducers({
  customers: customersReducer,
  projects: projectsReducer,
  projectRepos: projectReposReducer,
  currentCustomer: currentCustomerReducer,
  currentProject: currentProjectReducer,
  workspaceBuilder: workspaceBuilderReducer,
  layoutBuilder: layoutBuilderReducer,
  customerBuilder: customerBuilderReducer,
  repositoriesBuilder: repositoriesBuilderReducer,
});

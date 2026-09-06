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
} from './builders';

const rootReducer = combineReducers({
  customers: customersReducer,
  projects: projectsReducer,
  projectRepos: projectReposReducer,
  currentCustomer: currentCustomerReducer,
  currentProject: currentProjectReducer,
  workspaceBuilder: workspaceBuilderReducer,
  layoutBuilder: layoutBuilderReducer,
  customerBuilder: customerBuilderReducer,
});

export default rootReducer;

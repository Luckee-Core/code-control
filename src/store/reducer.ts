import { combineReducers } from '@reduxjs/toolkit';
import {
  customersReducer,
  softwareSystemsReducer,
  softwareSystemReposReducer,
  conventionsReducer,
  conventionsCatalogReducer,
  conventionExamplesReducer,
  conventionSourcesReducer,
  dataModelProposalsReducer,
  dataModelProposalExchangesReducer,
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
  conventionsBuilderReducer,
  dataModelBuilderReducer,
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
  conventionsCatalog: conventionsCatalogReducer,
  conventionExamples: conventionExamplesReducer,
  conventionSources: conventionSourcesReducer,
  currentConvention: currentConventionReducer,
  conventionsBuilder: conventionsBuilderReducer,
  dataModelProposals: dataModelProposalsReducer,
  dataModelProposalExchanges: dataModelProposalExchangesReducer,
  dataModelBuilder: dataModelBuilderReducer,
});

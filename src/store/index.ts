import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export { store } from './store';
export type { RootState, AppDispatch } from './store';
export type { AppThunk } from './types';

export * from './dumps';
export * from './builders';
export * from './current';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

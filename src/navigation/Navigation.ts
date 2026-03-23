import {
  NavigationContainerRef,
  NavigationState,
} from '@react-navigation/native';
import React from 'react';
import { RootStackParamList } from './Routes';
import Logger from '../utils/Logger';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

export function parseNavigationParams(state: NavigationState | undefined) {
  if (!state) return null;
  const { routes, index } = state;
  const currentRoute = routes[index];
  Logger.info('Current route:', {
    name: currentRoute.name,
    params: currentRoute.params,
  });
  return {
    name: currentRoute.name,
    params: currentRoute.params,
  };
}

export function setIsNavigationReady(isReady: boolean) {
  if (isReady) {
    Logger.info('Navigation is ready');
  } else {
    Logger.warn('Navigation is not ready');
  }
}

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
    Logger.info(`Navigating to ${name}`, params);
  } else {
    Logger.error('Navigation reference is not ready');
  }
}

export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
    Logger.info('Going back');
  } else {
    Logger.error('Navigation reference is not ready');
  }
}

export function getCurrentRoute() {
  if (navigationRef.current) {
    const route = navigationRef.current.getCurrentRoute();
    Logger.info('Current route:', route);
    return route;
  } else {
    Logger.error('Navigation reference is not ready');
    return null;
  }
}

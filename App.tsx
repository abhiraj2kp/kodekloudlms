import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import { Routes } from '@ui/routes/Routes';
import { persistor, store } from '@ui/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from '@ui/components/errorBoundary';
import InternetServices from '@ui/components/InternetServices';
import Toast from 'react-native-toast-message/';

const App = () => {
  LogBox.ignoreAllLogs();

  return (
    <React.Fragment>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ErrorBoundary>
                <Routes />
                <InternetServices />
                <Toast />
              </ErrorBoundary>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </React.Fragment>
  );
};

export default App;

import { NavigationActions, StackActions } from 'react-navigation';


let navigator;

function setNavigator(navigationRef) {
  navigator = navigationRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    NavigationActions.navigate({ routeName, params })
  )
}

function navigateAndReset(routeName, params) {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName,
          params
        })
      ]
    })
  )
}

function goBack() {
  navigator.dispatch(
    NavigationActions.back()
  )
}

export default {
  setNavigator,
  navigate,
  navigateAndReset,
  goBack
}

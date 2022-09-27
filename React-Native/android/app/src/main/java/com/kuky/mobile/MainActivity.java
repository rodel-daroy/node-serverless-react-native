package com.kuky.mobile;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.content.Intent;
import android.provider.MediaStore;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "kuky";
  }
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    /* System.out.println("reqCode" + requestCode);
    System.out.println("resCode" + resultCode);
    System.out.println("Jdata" + data); */

    if(requestCode == 13001 && data == null){
      data = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
      super.onActivityResult(requestCode, resultCode, data);
/*       System.out.println("reqCode" + requestCode);
      System.out.println("resCode" + resultCode);
      System.out.println("data" + data); */
    }else if(data != null){
      super.onActivityResult(requestCode, resultCode, data);
    }
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}

package com.fmf.lapetitefalope.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.util.Log;

import com.fmf.lapetitefalope.CanvasCameraActivity;

public class CanvasCamera extends CordovaPlugin {

    private CallbackContext mCallbackContext;
	
    @Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("showCaptureView".equals(action)) {
			
			mCallbackContext = callbackContext;
			
			Intent myIntent = new Intent(this.cordova.getActivity(), CanvasCameraActivity.class);
			cordova.startActivityForResult(this, myIntent, 1);
			
			return true;
		}
		return false; // Returning false results in a "MethodNotFound" error.
	}
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    	super.onActivityResult(requestCode, resultCode, intent);
    	
    	String filePath = intent.getExtras().getString("filePath");
		Log.d("kamera", "activity result, filepath is : "+ filePath);
    	
    	if (resultCode == 1) {
    		mCallbackContext.success(filePath);
    	}
    	
    }

}

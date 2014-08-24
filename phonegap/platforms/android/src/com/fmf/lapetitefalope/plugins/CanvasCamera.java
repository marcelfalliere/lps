package com.fmf.lapetitefalope.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;

import com.fmf.lapetitefalope.CanvasCameraActivity;

public class CanvasCamera extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("showCaptureView".equals(action)) {

			Intent myIntent = new Intent(this.cordova.getActivity(), CanvasCameraActivity.class);
			this.cordova.getActivity().startActivity(myIntent);

			//callbackContext.success();
			
			
			return true;
		}
		return false; // Returning false results in a "MethodNotFound" error.
	}

	public void startPhotoEditActivity() {

	}

}

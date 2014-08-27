package com.fmf.lapetitefalope.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.inputmethod.InputMethodManager;

import com.fmf.lapetitefalope.CanvasCameraActivity;

public class SoftKeyboard  extends CordovaPlugin {
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		Log.d("SoftKeyboard", "action !");
		if ("show".equals(action)) {
			Log.d("SoftKeyboard", "there!");
			
			InputMethodManager mgr = (InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
	        mgr.showSoftInput(webView, InputMethodManager.SHOW_IMPLICIT);
	        
	        ((InputMethodManager) cordova.getActivity().getSystemService(Context.INPUT_METHOD_SERVICE)).showSoftInput(webView, 0);
	
			return true;
		}
		return false; // Returning false results in a "MethodNotFound" error.
	}
}

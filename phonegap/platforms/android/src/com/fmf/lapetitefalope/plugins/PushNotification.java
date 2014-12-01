package com.fmf.lapetitefalope.plugins;

import org.apache.cordova.CordovaPlugin;
import org.apache.http.Header;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.*;

import android.content.Context;
import android.util.Log;

import com.fmf.lapetitefalope.lapetitefalope;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;
import com.loopj.android.http.SyncHttpClient;

public class PushNotification extends CordovaPlugin {

    static final String TAG = "GCMlpf";
	static String PUSH_BASE_URL = "https://cp.lapetitefalope.fr/";
	public void subscribeWithEvent(final String event, lapetitefalope mainActivity){

		Log.d(TAG, "subscribing to "+PUSH_BASE_URL);
		
		if (mainActivity==null) {
			mainActivity= (lapetitefalope)this.cordova.getActivity();
		}
		String registrationId = mainActivity.getRegistrationId(mainActivity);
		Log.d(TAG, "with registrationId"+registrationId);
		
		AsyncHttpClient client = new AsyncHttpClient(true, 80, 443);
		
		RequestParams params = new RequestParams();
		params.put("proto", "gcm");
		params.put("token", registrationId);

		client.post(PUSH_BASE_URL+"subscribers", params, new JsonHttpResponseHandler() {

		    @Override
		    public void onStart() {
		        // called before request is started
		    }

		    @Override
		    public void onRetry(int retryNo) {
		        // called when request is retried
			}
		    
		    @Override
		    public void onFailure(int arg0, Header[] arg1, String arg2, Throwable arg3) {
		    	Log.e(TAG, "failure at "+PUSH_BASE_URL+"subscribers");
		    	Log.e(TAG, arg0+"");
		    	Log.e(TAG, arg2+"");
		    	Log.e(TAG, arg3+"");
		    }

			@Override
			public void onSuccess(int arg0, Header[] arg1, JSONObject j) {
				Log.d(TAG, "first sub ok");
				try {
					final String sessionId = j.getString("id");

					AsyncHttpClient client = new AsyncHttpClient(true, 80, 443);
					
					RequestParams params = new RequestParams();
					params.put("proto", "gcm");

					client.post(PUSH_BASE_URL+"subscriber/"+sessionId+"/subscriptions/"+event, params, new JsonHttpResponseHandler() {

					    @Override
					    public void onStart() {
					        // called before request is started
					    }

					    @Override
					    public void onRetry(int retryNo) {
					        // called when request is retried
						}

						@Override
						public void onSuccess(int arg0, Header[] arg1, JSONObject j) {
							Log.d(TAG, "second sub ok");
						}

						@Override
					    public void onFailure(int arg0, Header[] arg1, String arg2, Throwable arg3) {
							Log.e(TAG, "failure at "+PUSH_BASE_URL+"subscriber/"+sessionId+"/subscriptions/"+event);
					    	Log.e(TAG, arg0+"");
					    	Log.e(TAG, arg2+"");
					    	Log.e(TAG, arg3+"");
					    }
					});
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
				
				
				
	            /*[manager POST:[NSString stringWithFormat:@"%@subscriber/%@/subscriptions/%@", PUSH_BASE_URL, sessionId, event] parameters:@{} success:^(AFHTTPRequestOperation *operation, id responseObject) {
	                
	            } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
	                
	            }];*/
				
			}
		});

	}
}

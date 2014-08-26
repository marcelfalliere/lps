package com.fmf.lapetitefalope;

import java.io.IOException;

import com.fmf.lapetitefalope.util.SystemUiHider;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.hardware.Camera;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RelativeLayout;

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 * 
 * @see SystemUiHider
 */
public class CanvasCameraActivity extends Activity {
	
	private KameraSurface preview;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_canvas_camera);

		Button takePicture = (Button)findViewById(R.id.take_picture);
		takePicture.setOnClickListener(new View.OnClickListener() {
			
			@Override
			public void onClick(View v) {
				preview.takePicture(new TakePictureCallback() {
					
					@Override
					public void fileSaved(Object error, String filePath) {
						Log.d("kamera", "file saved callback!!"+filePath);
						
						Intent intent = new Intent();
						intent.putExtra("filePath", filePath);
						setResult(1, intent);
						finish();
					}
				});
				
			}
		});
		
		preview = new KameraSurface(getApplicationContext());
        ((SquareLayout) findViewById(R.id.square)).addView(preview);
	}
	
	public static class  SquareLayout extends RelativeLayout {
		
		public SquareLayout(Context context) {
			super(context);
		}
		public SquareLayout(Context context, AttributeSet attrs) {
			super(context, attrs);
		}
		
		public SquareLayout(Context context, AttributeSet attrs, int defStyle) {
		    super(context, attrs, defStyle);
		}
		

		@Override
		public void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
		    super.onMeasure(widthMeasureSpec, widthMeasureSpec);
		}
		
		
	}

	public interface TakePictureCallback {
		public void fileSaved(Object error, String filePath);
	}
	
}

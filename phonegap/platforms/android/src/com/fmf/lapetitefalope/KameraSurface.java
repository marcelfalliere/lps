package com.fmf.lapetitefalope;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.Toast;

public class KameraSurface  extends SurfaceView implements SurfaceHolder.Callback {
    private static final String TAG = "Preview";

    SurfaceHolder mHolder;
    public Camera camera;
    private int camId = 0;

	private CanvasCameraActivity canvasCameraActivity;

    KameraSurface(Context context, CanvasCameraActivity canvasCameraActivity) {
        super(context);
		this.canvasCameraActivity = canvasCameraActivity;

        // Install a SurfaceHolder.Callback so we get notified when the
        // underlying surface is created and destroyed.
        mHolder = getHolder();
        mHolder.addCallback(this);
    }

    public void surfaceCreated(SurfaceHolder holder) {
        // The Surface has been created, acquire the camera and tell it where
        // to draw.
    	
    	Log.d("test", "->"+Camera.getNumberOfCameras());
    	if (Camera.getNumberOfCameras() > 1)  {
    		for (int i = 0 ; i < Camera.getNumberOfCameras() ; i++) {
    		    Camera.CameraInfo info = new Camera.CameraInfo();
    			Camera.getCameraInfo(i, info);
    			if (info.facing == Camera.CameraInfo.CAMERA_FACING_BACK) {
    				camId = i;
    			}
    		}
    	}
    	camera = Camera.open(camId);
    	
		Camera.Parameters p = camera.getParameters();
		//p.setPictureSize(80, 60);
		p.setColorEffect(android.hardware.Camera.Parameters.EFFECT_NONE);
		//p.setJpegQuality(20);
		//p.setPreviewFpsRange(5, 10);
		//p.setPreviewSize(80, 60);
		camera.setParameters(p);
		
		try {
			camera.setPreviewDisplay(holder);
			
			
			camera.setPreviewCallback(new Camera.PreviewCallback() {
				
				public void onPreviewFrame(byte[] data, Camera arg1) {
					//KameraSurface.this.invalidate();
				}
			});
		} catch (IOException e) {
			e.printStackTrace();
		}
	
    }

    public void surfaceDestroyed(SurfaceHolder holder) {
        // Surface will be destroyed when we return, so stop the preview.
        // Because the CameraDevice object is not a shared resource, it's very
        // important to release it when the activity is paused.
    	Log.d("kamera", "surface destroyed");
    	camera.setPreviewCallback(null);
        camera.stopPreview();
        camera.release();
        camera = null;
    }
    
    public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
        // Now that the size is known, set up the camera parameters and begin
        // the preview.
        Camera.Parameters parameters = camera.getParameters();
        //parameters.setPreviewSize(80, 60);
        camera.setParameters(parameters);
        
        camera.setDisplayOrientation(90);
        camera.startPreview();
    }

    @Override
    public void draw(Canvas canvas) {
            super.draw(canvas);
            Paint p= new Paint(Color.RED);
            Log.d(TAG,"draw");
            canvas.drawText("PREVIEW", canvas.getWidth()/2, canvas.getHeight()/2, p );
    }

	public void takePicture(final CanvasCameraActivity.TakePictureCallback callback) {
		camera.takePicture(null, null, new Camera.PictureCallback() {
			
			@Override
			public void onPictureTaken(byte[] data, Camera camera) {
				if (data != null) {
					
					
					FileOutputStream fos = null;
                    try {
                        
                        Log.d("kamera","coming here");
                        
                        Log.d("kamera","writing data");

                        
                        // create bitmap
                        Bitmap bmp;
                        BitmapFactory.Options options = new BitmapFactory.Options();
                        options.inMutable = true;
                        bmp = BitmapFactory.decodeByteArray(data, 0, data.length, options);

                        // actual crop
                        Bitmap croppedBmp = Bitmap.createBitmap(bmp, 0, 0, (bmp.getWidth()<bmp.getHeight())? bmp.getWidth() : bmp.getHeight(), (bmp.getWidth()<bmp.getHeight())? bmp.getWidth() : bmp.getHeight() );
                        Log.d("kamera", "size after crop :"+croppedBmp.getWidth()+" x "+croppedBmp.getHeight());
                        
                        // rotate
                        CameraInfo cameraInfo = new Camera.CameraInfo();
						Camera.getCameraInfo(camId, cameraInfo);
                        
                        Matrix matrix = new Matrix();
                        matrix.postRotate(cameraInfo.orientation);
                        Bitmap scaledBitmap = Bitmap.createScaledBitmap(croppedBmp,croppedBmp.getWidth(),croppedBmp.getHeight(),true);
                        Bitmap rotatedBitmap = Bitmap.createBitmap(scaledBitmap , 0, 0, scaledBitmap.getWidth(), scaledBitmap.getHeight(), matrix, true);
                        
                        // save
                        File outputDir = getContext().getCacheDir();
                        File outputFile = File.createTempFile("fmfpicture", new Date().getTime()+".jpeg", outputDir);
                        fos = new FileOutputStream(outputFile);
                        rotatedBitmap.compress(Bitmap.CompressFormat.JPEG, 60, fos);
                        
                        // done !
                        callback.fileSaved(null, outputFile.getAbsolutePath());
                        
                        
                    }  catch (IOException e) {
                        //do something about it
                        Log.d("kamera","some exception"+ e);
                        
                    }  finally {
                    	
                    	try {
                    		if (fos != null) {
    							fos.close();
                    		}
						} catch (IOException e) {
							e.printStackTrace();
						}
                    }
					
					
				} else {
					// Data is null
				}
				
			}
		});
		
	}
}
//
//  PushNotification.h
//  lapetitefalope
//
//  Created by Frédéric Falliere on 08/03/2014.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface PushNotification : CDVPlugin

- (void)subscribe:(CDVInvokedUrlCommand*)command;

+ (void)subscribeWithEvent:(NSString*)event;

@end

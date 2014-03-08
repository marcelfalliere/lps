//
//  PushNotification.m
//  lapetitefalope
//
//  Created by Frédéric Falliere on 08/03/2014.
//
//


#import "PushNotification.h"
#import "AFHTTPRequestOperationManager.h"

@implementation PushNotification


- (void)subscribe:(CDVInvokedUrlCommand*)command {
    NSString* event = [command.arguments objectAtIndex:0];
    
    [PushNotification subscribeWithEvent:event];
}

+ (void)subscribeWithEvent:(NSString*)event {
    NSString* dToken = [[NSUserDefaults standardUserDefaults]valueForKey:@"DEVICE_TOKEN"];
    
    if (dToken!=nil){
        AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
        NSDictionary *parameters = @{@"proto": @"apns", @"token":dToken};
        [manager POST:@"http://62.210.237.246:8888/subscribers" parameters:parameters success:^(AFHTTPRequestOperation *operation, id responseObject) {
            
            NSString* sessionId = [responseObject valueForKey:@"id"];
            
            [manager POST:[NSString stringWithFormat:@"http://62.210.237.246:8888/subscriber/%@/subscriptions/%@", sessionId, event] parameters:@{} success:^(AFHTTPRequestOperation *operation, id responseObject) {
                
                NSLog(@"All went OK : %@", responseObject);
                
            } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
                NSLog(@"Error subscribing to newfalope event: %@", error);
            }];
            
        } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
            
            NSLog(@"Error subscribing to push server: %@, device token:%@, statusCode:%@", error, dToken, operation.responseObject);
        }];
    }
    
}



@end

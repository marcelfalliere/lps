//
//  PushNotification.m
//  lapetitefalope
//
//  Created by Frédéric Falliere on 08/03/2014.
//
//


#import "PushNotification.h"
#import "AFHTTPRequestOperationManager.h"

static NSString* PUSH_BASE_URL = @"https://cp.lapetitefalope.fr/";

@implementation PushNotification


- (void)subscribe:(CDVInvokedUrlCommand*)command {
    NSString* event = [command.arguments objectAtIndex:0];
    
    [PushNotification subscribeWithEvent:event];
}

+ (void)subscribeWithEvent:(NSString*)event {
    NSString* dToken = [[NSUserDefaults standardUserDefaults]valueForKey:@"DEVICE_TOKEN"];
    NSLog(@"devicetoken : %@", dToken);
    if (dToken!=nil){
        AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
        manager.securityPolicy.allowInvalidCertificates = YES;
        NSDictionary *parameters = @{@"proto": @"apns", @"token":dToken};
        [manager POST:[NSString stringWithFormat:@"%@subscribers",PUSH_BASE_URL] parameters:parameters success:^(AFHTTPRequestOperation *operation, id responseObject) {
            
            NSString* sessionId = [responseObject valueForKey:@"id"];
            
            [manager POST:[NSString stringWithFormat:@"%@subscriber/%@/subscriptions/%@", PUSH_BASE_URL, sessionId, event] parameters:@{} success:^(AFHTTPRequestOperation *operation, id responseObject) {
                
                NSLog(@"All went OK : %@", responseObject);
                
            } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
                
            }];
            
        } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
            
            NSLog(@"Error subscribing to push server: %@, device token:%@, statusCode:%@", error, dToken, operation.responseObject);
        }];
    }
    
}



@end

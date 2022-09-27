//
//  WidgetHelper.m
//  kuky
//
//  Created by ST JOE on 22/01/21.
//  Copyright © 2021 Facebook. All rights reserved.

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetHelper, NSObject)
RCT_EXTERN_METHOD(UpdateNote: (NSString *)note)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

//
//  WidgetHelper.swift
//  kuky
//
//  Created by ST JOE on 22/01/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation
import SwiftUI
import WidgetKit

@available(iOS 14.0, *)
@objc(WidgetHelper)
class WidgetHelper: NSObject, RCTBridgeModule {
  @AppStorage("widget_data", store: UserDefaults(suiteName: "group.kuky.widget"))
  var data: Data = Data()
  
  static func moduleName() -> String! {
    return "WidgetHelper"
  }
  
  @objc
  func UpdateNote(_ text: NSString) -> Void {
    let widgetData = WidgetData(text: text as String)
    guard let data = try? JSONEncoder().encode(widgetData) else {return}
    
    self.data = data
    
    WidgetCenter.shared.reloadAllTimelines()
  }
}

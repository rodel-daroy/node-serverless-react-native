//
//  WidgetData.swift
//  kuky
//
//  Created by ST JOE on 22/01/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation

struct WidgetData: Identifiable, Codable {
  var text: String
  var id: String { text }
}

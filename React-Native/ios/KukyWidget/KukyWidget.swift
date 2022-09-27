//
//  KukyWidget.swift
//  KukyWidget
//
//  Created by ST JOE on 26/01/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import WidgetKit
import SwiftUI


struct Provider: TimelineProvider {
  
  @AppStorage("widget_data", store: UserDefaults(suiteName: "group.kuky.widget"))
  var userId: Data = Data()
  func getWalletData(completion: @escaping
                      (SimpleEntry.BTCData?) -> Void) {
    
    let widgetData = try? JSONDecoder().decode(WidgetData.self, from: userId)
    
    var textData = ""
    textData = widgetData!.text
    
    guard let url = URL(string:
                          "https://mobile.kuky.com/prod/api/wallet")
    else
    { return completion (nil) }
    
    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.addValue(textData, forHTTPHeaderField: "access-token")
    request.addValue("application/json", forHTTPHeaderField: "content-type")
    
    URLSession.shared.dataTask(with: request){ d, res, err
      in
      var result: SimpleEntry.BTCData?
      
      if let data = d,
         let response = res as? HTTPURLResponse,
         response.statusCode == 200 {
        do {
          result = try
            JSONDecoder().decode(SimpleEntry
                                  .BTCData.self, from: data)
        } catch {
          print(error)
        }
      }
      return completion(result)
    }
    .resume()
  }
  
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(date: Date(), widgetData: WidgetData(text: "PlaceHolder"), data: 0.0)
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    getWalletData { data in
      let entry = SimpleEntry(date: Date(), widgetData: WidgetData(text: "SnapShot"), data: data?.data.balanceUSD ?? 0.0)
      completion(entry)
    }
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    let widgetData = try? JSONDecoder().decode(WidgetData.self, from: userId)
    getWalletData { data in
      let timeline = Timeline(
        entries: [SimpleEntry(date: Date(), widgetData: widgetData ?? WidgetData(text: "SnapShot"), data: data?.data.balanceUSD ?? -999)],
        policy: .after(Calendar.current.date(byAdding: .minute, value: 5, to: Date())!
        )
      )
      completion(timeline)
    }
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let widgetData: WidgetData
  let data: Double
  
  struct BTCData: Decodable{
    var data: WData
    
    enum CodingKeys: String, CodingKey {
      case data
    }
  }
  struct WData: Decodable {
    var balanceUSD: Double
  }
}



struct KukyWidgetEntryView : View {
  @Environment(\.widgetFamily) var family
  
  var entry: Provider.Entry
  
  var body: some View {
    ZStack{
      Image("bg").resizable()
      VStack{
        header.foregroundColor(Color("headerColor"))
        coin.foregroundColor(Color("headerColor"))
        Spacer()
      }
    }
  }
  var header : some View {
    HStack{
      Text("LTC Balance").bold().font(family == .systemLarge ? .system(size: 20) : .system(size: 12)).padding()
      Spacer()
    }
  }
  var coin : some View {
    HStack{
      if(entry.widgetData.text == "Please login") {
        Text("Please login").bold().font(family == .systemLarge ? .system(size: 24) : .system(size: 22)).foregroundColor(Color("headerColor")).padding()
      } else {
        if(entry.data == -999) {
          Text("Bad connection").bold().font(family == .systemLarge ? .system(size: 22) : .system(size: 18)).foregroundColor(Color("headerColor")).padding()
        } else {
          Text("$ "+String(format: "%0.1f",entry.data).description).bold().font(family == .systemLarge ? .system(size: 18) : .system(size: 21)).foregroundColor(Color("headerColor")).padding()
        }
      }
      Spacer()
    }
  }
}

@main
struct KukyWidget: Widget {
  let kind: String = "KukyWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      KukyWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Kuky Widget")
    .description("Kuky Wallet")
    .supportedFamilies([.systemSmall])
  }
}

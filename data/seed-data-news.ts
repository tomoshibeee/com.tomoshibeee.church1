import { GlobalNews } from "../models/global-news";
import { getRandomDate } from "@/utils/date/get-random-date";

export function dummyNewsModelData(): GlobalNews[] {
  return [
    {
      title: "システムメンテナンスのお知らせ",
      content: "安定したサービス提供のため、下記日程でシステムメンテナンスを実施いたします。期間中は一部機能がご利用いただけません。",
      event_date: "2026-07-10",
      published_at: getRandomDate(),
    },
    {
      title: "Apple Walletから名刺がわりになる「Apple Contact Card」発表",
      content: "Appleは新機能「Apple Contact Card」を発表しました。デジタル名刺としての活用が期待されています。",
      event_date: "2026-06-20",
      published_at: getRandomDate(),
    },
    {
      title: "料金改定のお知らせ",
      content: "サービス品質向上のため、2026年8月1日より一部プランの料金を改定いたします。",
      event_date: "2026-08-01",
      published_at: getRandomDate(),
    },
    {
      title: "新機能リリースのお知らせ",
      content: "サイト編集機能の強化として、新しいブロックタイプを追加しました。より柔軟なレイアウトが可能になります。",
      event_date: "2026-06-15",
      published_at: getRandomDate(),
    },
    {
      title: "年末年始の営業について",
      content: "年末年始期間中はサポート対応が通常より遅れる場合がございます。あらかじめご了承ください。",
      event_date: "2026-12-29",
      published_at: getRandomDate(),
    },
    {
      title: "夏季休暇について",
      content: "誠に勝手ながら、夏季休暇のため一部業務を休止いたします。",
      event_date: "2026-08-13",
      published_at: getRandomDate(),
    },
    {
      title: "春季イベントのお知らせ",
      content: "春の特別イベントを開催します。新規ユーザー向けキャンペーンも実施予定です。",
      event_date: "2026-04-05",
      published_at: getRandomDate(),
    },
    {
      title: "秋季セールのお知らせ",
      content: "期間限定でプレミアム機能を割引価格で提供します。この機会をお見逃しなく。",
      event_date: "2026-10-01",
      published_at: getRandomDate(),
    },
    {
      title: "冬季特別キャンペーン",
      content: "冬限定の特別キャンペーンを実施中。登録ユーザー全員に特典を提供します。",
      event_date: "2026-12-01",
      published_at: getRandomDate(),
    },
    {
      title: "春季特別割引",
      content: "新生活応援キャンペーンとして、期間限定の特別割引を実施します。",
      event_date: "2026-03-20",
      published_at: getRandomDate(),
    },
  ];
}
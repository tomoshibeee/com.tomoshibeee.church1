// utils/generateInitialSiteData.ts
import { SiteData } from "@/types/site";

export function generateInitialSiteData(name: string, slug: string): SiteData {
    return {
        meta: {
            name: name,
            slug: slug,
            description: `${name}の公式サイトです。`,
            tel: "000-0000-0000",
            email: "info@example.com",
            postalCode: "000-0000",
            address: "住所を入力してください",
            bldg: "",
            access: "アクセス情報を入力してください",
            background_image: "https://picsum.photos/1200/600",
            avatar: "https://picsum.photos/200/200",
        },
        navigation: {
            menu: [
                { label: "ホーム", href: "#hero" },
                { label: "紹介", href: "#about" },
                { label: "案内", href: "#service" },
                { label: "アクセス", href: "#access" },
                { label: "お問い合わせ", href: "#contact" },
            ],
        },
        layout: {
            sections: [
                {
                    id: "hero",
                    type: "hero",
                    blocks: [
                        {
                            id: "hero-main",
                            type: "hero",
                            variant: "single",
                            data: {
                                title: `${name}へようこそ`,
                                images: [{ url: "https://picsum.photos/1200/600", alt: name }],
                            },
                        },
                    ],
                },
                {
                    id: "about",
                    type: "about",
                    blocks: [
                        {
                            id: "about-main",
                            type: "greeting",
                            variant: "default",
                            data: {
                                name: "代表者名",
                                role: "代表",
                                image: "https://i.pravatar.cc/150",
                                bio: "プロフィールの紹介文をここに入力してください。",
                                message: "みなさまへのご挨拶文をここに入力してください。",
                            },
                        },
                    ],
                },
                {
                    id: "service",
                    type: "service",
                    blocks: [
                        {
                            id: "service-main",
                            type: "service",
                            variant: "default",
                            data: {
                                items: [
                                    {
                                        id: "s1",
                                        title: "活動・サービス内容",
                                        time: "日時・営業時間",
                                        location: "場所",
                                        comment: "詳細な説明文をここに入力してください。",
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    id: "access",
                    type: "access",
                    blocks: [
                        {
                            id: "access-block",
                            type: "access",
                            variant: "default",
                            data: {},
                        },
                    ],
                },
                {
                    id: "contact",
                    type: "contact",
                    blocks: [
                        {
                            id: "contact-main",
                            type: "contact",
                            variant: "default",
                            data: { description: "お気軽にお問い合わせください。" },
                        },
                    ],
                },
            ],
        },
    };
}
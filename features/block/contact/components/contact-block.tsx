import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";

import { ContactBlockData } from "@/features/block";
import { MetaData } from "@/types/site-meta";
import ContactForm from "./contact-form";

type Props = ContactBlockData & {
  meta: MetaData;
  onOpenMetaEditor: () => void;
  edit?: boolean;
};

export default function ContactBlock(props: Props) {
  const {
    title = "お問い合わせ",
    description = "礼拝や集会、見学についてなど、お気軽にお問い合わせください。",
    submitLabel = "メールを作成する",
    meta,
    edit,
  } = props;
  return (
    <div className="bg-slate-50 px-6 py-14">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">Contact</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 leading-7 text-gray-600">{description}</p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <a
              href={`tel:${meta.tel}`}
              className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm transition hover:text-blue-600"
            >
              <FaPhone className="shrink-0 text-blue-500" />
              <span>{meta.tel}</span>
            </a>
            <a
              href={`mailto:${meta.email}`}
              className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm transition hover:text-blue-600"
            >
              <FaEnvelope className="shrink-0 text-blue-500" />
              <span>{meta.email}</span>
            </a>
            <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
              <FaLocationDot className="shrink-0 text-blue-500" />
              <span className="leading-6">
                {meta.postalCode && (
                  <>
                    〒{meta.postalCode}
                    <br />
                  </>
                )}
                {meta.address}
                {meta.bldg && (
                  <>
                    <br />
                    {meta.bldg}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <ContactForm email={meta.email} submitLabel={submitLabel} />
      </div>
    </div>
  );
}

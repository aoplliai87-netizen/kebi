import { redirect } from "next/navigation";

type Props = {
  params: { locale: string };
};

export default function SupportPage({ params }: Props) {
  redirect(`/${params.locale}/inquiry`);
}

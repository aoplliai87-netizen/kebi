import { redirect } from "next/navigation";

type Props = {
  params: {
    locale: string;
    rest: string[];
  };
};

export default function LocaleFallbackPage({ params }: Props) {
  redirect(`/${params.locale}`);
}

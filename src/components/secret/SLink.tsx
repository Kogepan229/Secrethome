import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
  href: string;
  as?: string;
  children?: ReactNode;
};

const SLink = (props: Props) => {
  const router = useRouter()
  const click = (e: any, {href, as}: {href: string, as?: string}) => {
    router.push(href, as)
  }

  return (<div onClick={e => click(e, {href: props.href, as: props.as})}>{props.children}</div>);
}

export default SLink
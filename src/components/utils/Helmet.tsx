import type React from "react";
import {Helmet as HelmetComponent} from "react-helmet";


interface HelmetProp {
  title?: string,
  description?: string,
  children?: React.ReactNode
}


export const Helmet = ({
  title,
  description,
  children
}: HelmetProp) => {
  return (
    <HelmetComponent>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </HelmetComponent>
  );
};

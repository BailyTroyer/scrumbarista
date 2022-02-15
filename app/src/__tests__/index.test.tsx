import { render } from "@testing-library/react";

import Index from "../pages/index";

describe("Index Page", () => {
  it("renders hero with `Get started` button", () => {
    const { getByText } = render(<Index />);

    expect(getByText("Get started")).toBeInTheDocument();
  });
});

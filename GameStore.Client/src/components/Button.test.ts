import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  it("renders the default slot content", () => {
    const wrapper = mount(Button, { slots: { default: "Click me" } });

    expect(wrapper.text()).toBe("Click me");
  });

  it("defaults to the primary variant and is not disabled", () => {
    const wrapper = mount(Button);

    expect(wrapper.classes()).toContain("bg-slate-900");
    expect(wrapper.attributes("disabled")).toBeUndefined();
  });

  it.each([
    ["secondary", "ring-1"],
    ["danger", "bg-rose-600"],
  ] as const)("applies %s variant classes", (variant, expectedClass) => {
    const wrapper = mount(Button, { props: { variant } });

    expect(wrapper.classes()).toContain(expectedClass);
  });

  it("reflects the disabled prop onto the native button element", () => {
    const wrapper = mount(Button, { props: { disabled: true } });

    expect(wrapper.attributes("disabled")).toBeDefined();
  });
});

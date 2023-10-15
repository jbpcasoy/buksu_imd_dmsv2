import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentEditorReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ContentEditorReview");
    can("create", "ContentEditorReview");
    can("update", "ContentEditorReview");
    can("delete", "ContentEditorReview");
  });

  return ability;
}

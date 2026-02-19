export function detectSpecialty(languages) {
  const langs = Object.keys(languages).join(" ").toLowerCase();

  if (langs.match(/python|tensorflow|pytorch|opencv|numpy/))
    return "AI / Machine Learning";

  if (langs.match(/javascript|typescript|html|css|react|node/))
    return "Web Development";

  if (langs.match(/c|cpp|arduino|embedded/))
    return "Embedded / IoT";

  if (langs.match(/kotlin|swift|flutter|dart/))
    return "Mobile Development";

  if (langs.match(/docker|bash|linux|yaml/))
    return "DevOps & Automation";

  return "Software Development";
}

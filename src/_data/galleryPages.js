module.exports = async () => {
	const galleryPages = [];
	const glob = require("glob");
	const path = require("path");
	const fs = require("fs");
	const slugify = require("slugify");
	const productFiles = glob.sync("src/products/*.md");

	productFiles.forEach((productPath) => {
		const content = fs.readFileSync(productPath, "utf8");
		const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatterMatch) return;

		const frontMatter = frontmatterMatch[1];

		const galleryMatch = frontMatter.match(/gallery:\n([\s\S]*?)(?:\n\w|$)/);
		if (!galleryMatch) return;

		const galleryStr = galleryMatch[1];
		const galleryLines = galleryStr.split("\n").filter((line) => line.trim());

		const productSlug = path.basename(productPath, ".md");

		galleryLines.forEach((line) => {
			const match = line.match(/\s\s(.*?): (.*)/);
			if (!match) return;

			const [_, imageName, imageSrc] = match;
			const imageSlug = slugify(imageName, {
				lower: true,
				strict: true,
			});

			let productName = frontMatter.match(/title: (.*)/)[1].trim();

			let shortDescription = frontMatter.match(/short_description: (.*)/);
			shortDescription = shortDescription ? shortDescription[1].trim() : null;

			galleryPages.push({
				productSlug,
				header_text: productName,
				short_description: shortDescription,
				meta_title: `${productName} > ${imageName}`,
				header_image: frontMatter.match(/header_image: (.*)/)[1].trim(),
				imageName,
				imageSrc: imageSrc.trim(),
				imageSlug,
				navigationParent: "Products",
			});
		});
	});

	return galleryPages;
};

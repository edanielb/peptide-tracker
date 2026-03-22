#!/usr/bin/env python3
"""Generate peptide images using Google Gemini API and save to public/Images/."""

import io
import os
from PIL import Image
from google import genai

API_KEY = "AIzaSyDZzt_91f9eZnuRCQADsWH_HT9EWduNlD0"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "Images")

# Peptide image prompts - scientific/medical style illustrations
PEPTIDES = {
    "BPC-157": (
        "A clean, modern scientific illustration of the BPC-157 peptide molecule "
        "(Body Protection Compound-157) showing its 15 amino acid chain structure. "
        "Include visual elements suggesting tissue healing and regeneration — "
        "such as repaired muscle fibers and blood vessel formation. "
        "Use a dark blue and teal color palette with a clean dark background. "
        "Professional medical illustration style, high quality."
    ),
    "TB-500": (
        "A clean, modern scientific illustration of the TB-500 peptide "
        "(Thymosin Beta-4) showing its molecular structure. "
        "Include visual elements of cell migration, wound healing, and "
        "anti-inflammatory action. Show muscle and tissue recovery imagery. "
        "Use a dark blue and green color palette with a clean dark background. "
        "Professional medical illustration style, high quality."
    ),
    "Epitalon": (
        "A clean, modern scientific illustration of the Epitalon peptide "
        "(Epithalon/Epithalone) showing its tetrapeptide structure. "
        "Include visual elements related to telomere lengthening and anti-aging — "
        "such as DNA double helix with telomere caps being extended. "
        "Use a purple and blue color palette with a clean dark background. "
        "Professional medical illustration style, high quality."
    ),
    "Ipamorelin": (
        "A clean, modern scientific illustration of the Ipamorelin peptide "
        "showing its pentapeptide molecular structure. "
        "Include visual elements of growth hormone release from the pituitary gland, "
        "muscle growth, and metabolic enhancement. "
        "Use a blue and orange color palette with a clean dark background. "
        "Professional medical illustration style, high quality."
    ),
    "CJC-1295": (
        "A clean, modern scientific illustration of the CJC-1295 peptide "
        "showing its 30 amino acid modified GHRH structure. "
        "Include visual elements of growth hormone releasing hormone signaling, "
        "sustained release mechanism, and body composition improvement. "
        "Use a teal and gold color palette with a clean dark background. "
        "Professional medical illustration style, high quality."
    ),
}


def generate_image(client, peptide_name, prompt):
    """Generate an image for a peptide and save it."""
    print(f"Generating image for {peptide_name}...")

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_data = part.inline_data.data
            filename = f"{peptide_name}.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)

            img = Image.open(io.BytesIO(image_data))
            img = img.convert("RGB")
            img.save(filepath, "JPEG", quality=90)

            print(f"  Saved: {filepath}")
            return filepath

    print(f"  WARNING: No image generated for {peptide_name}")
    return None


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Generate peptide images via Gemini API")
    parser.add_argument("--prompt", type=str, help="Custom image prompt (generates a single image)")
    parser.add_argument("--name", type=str, help="Filename (without extension) for the custom image")
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    client = genai.Client(api_key=API_KEY)

    if args.prompt and args.name:
        # Single image mode — used by the daily content skill
        result = generate_image(client, args.name, args.prompt)
        if result:
            print(f"Image saved: {result}")
        else:
            print("Image generation failed.")
    else:
        # Batch mode — generate all predefined peptide images
        results = []
        for name, prompt in PEPTIDES.items():
            result = generate_image(client, name, prompt)
            results.append((name, result))

        print("\n--- Summary ---")
        for name, path in results:
            status = f"OK -> {path}" if path else "FAILED"
            print(f"  {name}: {status}")


if __name__ == "__main__":
    main()

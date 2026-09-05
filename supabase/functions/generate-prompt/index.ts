import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, imageBase64, instruction, sceneDescription, cameraMovement, duration, characterData, simplePrompt, outputFormat } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userMessage = "";
    
    switch (type) {
      case "image":
        systemPrompt = `Kamu adalah ahli prompt engineering untuk AI image generation seperti Midjourney dan Stable Diffusion. Analisis gambar yang diberikan dan buat prompt yang sangat detail dan profesional dalam Bahasa Inggris.

Format output harus mencakup:
1. Deskripsi subjek utama (pose, ekspresi, pakaian, aksesoris)
2. Latar belakang dan setting
3. Pencahayaan dan suasana
4. Gaya fotografi atau artistik
5. Teknis kamera (jika relevan)
6. Parameter tambahan (--ar, --v, --style, dll)

Buat prompt yang bisa langsung digunakan di Midjourney atau Stable Diffusion.`;
        
        userMessage = imageBase64 
          ? `Analisis gambar berikut dan buat prompt profesional.${instruction ? `\n\nInstruksi tambahan: ${instruction}` : ""}`
          : `Buat prompt gambar berdasarkan instruksi berikut: ${instruction}`;
        break;
        
      case "video":
        systemPrompt = `Kamu adalah ahli cinematography dan prompt engineering untuk AI video generation seperti Runway, Pika, dan Sora. Buat prompt video sinematik yang profesional.

Format output harus mencakup:
1. Deskripsi adegan lengkap
2. Gerakan kamera yang spesifik
3. Pencahayaan dan color grading
4. Mood dan atmosfer
5. Teknis kamera dan equipment
6. Durasi dan frame rate
7. Parameter video (--video, --duration, --fps, --ar)`;

        userMessage = `Buat prompt video sinematik dengan detail berikut:
Deskripsi Adegan: ${sceneDescription}
Gerakan Kamera: ${cameraMovement}
Durasi: ${duration} detik

${imageBase64 ? "Referensi visual telah diberikan." : ""}`;
        break;
        
      case "character":
        systemPrompt = `Kamu adalah ahli character design dan prompt engineering. Buat "DNA Karakter" yang konsisten untuk digunakan di berbagai prompt AI image generation.

Pastikan hasilnya mencakup deskripsi yang sangat spesifik tentang:
1. Fitur wajah yang unik dan terukur
2. Proporsi tubuh
3. Gaya pakaian signature
4. Aksesoris khas
5. Pose dan gesture khas
6. Color palette

Format output harus bisa langsung ditambahkan ke prompt apapun untuk menjaga konsistensi karakter.`;

        userMessage = `Buat DNA Karakter dengan data berikut:
Nama: ${characterData.name}
Usia: ${characterData.age}
Gender: ${characterData.gender}
Ciri Wajah: ${characterData.faceFeatures}
Pakaian: ${characterData.clothing}
Gaya: ${characterData.style}
Mood: ${characterData.mood}`;
        break;
        
      case "enhance":
        systemPrompt = `Kamu adalah ahli prompt engineering. Tugas kamu adalah menyempurnakan prompt sederhana menjadi prompt profesional yang sangat detail.

Tingkatkan prompt dengan menambahkan:
1. Detail visual yang lebih spesifik
2. Pencahayaan dan atmosfer
3. Komposisi dan sudut pandang
4. Gaya artistik yang tepat
5. Kualitas teknis
6. Parameter optimasi

Jaga esensi prompt asli tapi buatlah lebih powerful dan profesional.`;

        userMessage = `Sempurnakan prompt berikut menjadi prompt profesional:

"${simplePrompt}"`;
        break;
        
      case "negative":
        systemPrompt = `Kamu adalah ahli negative prompt untuk AI image generation. Buat negative prompt yang komprehensif untuk menghindari hasil yang tidak diinginkan.

Negative prompt harus mencakup kategori:
1. Kualitas buruk (blur, noise, artifacts, distortion)
2. Anatomi salah (extra limbs, deformed, bad hands)
3. Komposisi buruk (cropped, out of frame, bad composition)
4. Gaya tidak diinginkan sesuai konteks
5. Elemen visual yang mengganggu

Format output adalah daftar kata/frasa yang dipisahkan koma, siap pakai.`;

        userMessage = simplePrompt 
          ? `Buat negative prompt yang sesuai untuk prompt ini: "${simplePrompt}"`
          : "Buat negative prompt universal yang komprehensif untuk fotografi portrait profesional.";
        break;
        
      default:
        throw new Error("Tipe tidak valid");
    }

    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (imageBase64 && (type === "image" || type === "video")) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userMessage },
          { 
            type: "image_url", 
            image_url: { 
              url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` 
            } 
          }
        ]
      });
    } else {
      messages.push({ role: "user", content: userMessage });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit tercapai. Coba lagi nanti." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit habis. Silakan tambah kredit di pengaturan." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Gagal menghasilkan prompt");
    }

    const data = await response.json();
    const promptText = data.choices?.[0]?.message?.content || "";

    // Create structured JSON output if requested
    let jsonOutput = null;
    if (outputFormat === "json" || outputFormat === "both") {
      jsonOutput = {
        type,
        model: "Gemini 2.5 Flash",
        input_gambar: imageBase64 ? "Gambar referensi diberikan" : null,
        atribut_karakter: type === "character" ? characterData : null,
        instruksi_user: instruction || sceneDescription || simplePrompt,
        prompt_text: promptText,
        prompt_json_structure: {
          subject: extractSection(promptText, "subjek", "subject"),
          environment: extractSection(promptText, "latar", "environment", "background"),
          lighting: extractSection(promptText, "pencahayaan", "lighting"),
          style: extractSection(promptText, "gaya", "style"),
          technical: extractSection(promptText, "teknis", "technical", "camera"),
          parameters: extractParameters(promptText),
        },
        metadata: {
          generated_at: new Date().toISOString(),
          generator_type: type,
          ai_model: "google/gemini-2.5-flash",
        },
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        prompt_text: promptText,
        prompt_json: jsonOutput,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-prompt error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractSection(text: string, ...keywords: string[]): string {
  const lines = text.split("\n");
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (keywords.some(kw => lowerLine.includes(kw))) {
      return line.replace(/^[\d\.\-\*\s]+/, "").trim();
    }
  }
  return "";
}

function extractParameters(text: string): Record<string, string> {
  const params: Record<string, string> = {};
  const regex = /--(\w+)\s+([^\s]+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    params[match[1]] = match[2];
  }
  return params;
}

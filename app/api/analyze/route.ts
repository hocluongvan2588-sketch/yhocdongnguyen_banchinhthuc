import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { SYSTEM_INSTRUCTION } from '@/lib/ai/prompts/system-instruction';
import { buildUnifiedMedicalPrompt, UNIFIED_MEDICAL_CONFIG } from '@/lib/prompts/unified-medical.prompt';
import {
  buildJsonFormatterPrompt,
  JSON_FORMATTER_CONFIG,
} from '@/lib/prompts/json-formatter.prompt';
import {
  getSeasonInfo,
  analyzeSeasonRelation,
} from '@/lib/utils/lunar-calendar';

const openai = createOpenAI();

/**
 * Tạo fallback response dựa trên dữ liệu đã tính toán
 * Sử dụng khi AI không khả dụng hoặc bị content filter chặn
 */
function generateFallbackAnalysis(
  maihua: any,
  diagnostic: any,
  patientContext: any,
  seasonInfo: any,
  subjectInfo?: { label: string; pronoun: string }
) {
  // Đảm bảo thông tin cá nhân luôn chính xác trong fallback
  const genderText = patientContext.gender === 'nam' ? 'Nam' : 'Nữ';
  const subject = patientContext.subject || 'banthan';
  const pronoun = subjectInfo?.pronoun || 'bạn';
  const upperTrigram = diagnostic.mapping?.upperTrigram;
  const lowerTrigram = diagnostic.mapping?.lowerTrigram;
  const movingLine = maihua.movingLine || 1;
  const severity = diagnostic.expertAnalysis?.tiDung?.severity || 'trung bình';
  
  // Xác định tạng bệnh từ quẻ
  const affectedOrgan = upperTrigram?.primaryOrgans?.[0] || 'Gan';
  const motherOrgan = lowerTrigram?.primaryOrgans?.[0] || 'Thận';
  
  // Lấy thông tin mùa
  const tietKhi = seasonInfo.tietKhi?.name || 'Đại Hàn';
  const seasonElement = seasonInfo.tietKhi?.element || 'Thủy';
  const seasonRelation = seasonInfo.seasonAnalysis?.relation || 'thuận';
  const season = seasonInfo.tietKhi?.season || 'Đông';
  
  // Tính toán triệu chứng từ diagnostic
  const symptoms = diagnostic.mapping?.relatedDiseases?.slice(0, 5) || [
    'Mệt mỏi, thiếu năng lượng',
    'Rối loạn tiêu hóa nhẹ',
    'Căng thẳng, khó ngủ'
  ];
  
  // Tính toán cảm xúc từ quẻ
// Bảng Thất tình theo Ngũ hành (Y học cổ truyền)
  const emotionDetailMap: Record<string, { emotion: string; feeling: string; tcmMechanism: string }> = {
    'Mộc': { 
      emotion: 'Giận dữ, căng thẳng',
      feeling: 'dễ cáu gắt, bực tức vì những chuyện nhỏ, khó kiềm chế cơn nóng giận',
      tcmMechanism: 'Gan chủ sơ tiết, khi Giận dữ làm Khí Gan thượng xung, không sơ tiết được, gây đau đầu, chóng mặt, tức ngực'
    },
    'Hỏa': { 
      emotion: 'Hưng phấn quá độ, lo âu',
      feeling: 'quá vui hoặc quá lo lắng, tâm trạng thất thường, khó tập trung',
      tcmMechanism: 'Tâm chủ thần minh, khi Vui quá làm Tâm Khí tản mát, không tàng Thần được, gây mất ngủ, hồi hộp'
    },
    'Thổ': { 
      emotion: 'Lo nghĩ, suy tư nhiều',
      feeling: 'hay suy nghĩ nhiều, trằn trọc về công việc/gia đình, khó buông bỏ lo lắng',
      tcmMechanism: 'Tỳ chủ vận hóa, khi Lo nghĩ quá làm Tỳ Khí uất kết, không vận hóa được, gây chán ăn, đầy bụng'
    },
    'Kim': { 
      emotion: 'Buồn bã, u sầu',
      feeling: 'buồn bã, bi quan, hay thở dài, cảm thấy mệt mỏi tinh thần',
      tcmMechanism: 'Phế chủ khí, khi Buồn quá làm Phế Khí hao tán, không tuyên phát được, gây thở ngắn, dễ khóc'
    },
    'Thủy': { 
      emotion: 'Sợ hãi, bất an',
      feeling: 'hay lo sợ vô cớ, bất an, ngủ không yên giấc, dễ giật mình',
      tcmMechanism: 'Thận chủ chí, khi Sợ hãi làm Thận Khí hạ hãm, không nạp khí được, gây tiểu đêm, lưng gối yếu'
    }
  };
  const upperElement = upperTrigram?.element || 'Mộc';
  const emotionDetail = emotionDetailMap[upperElement] || emotionDetailMap['Mộc'];
  const emotion = emotionDetail.emotion;
  
  // Tạo explanation chi tiết hơn với 4 đoạn
  const detailedExplanation = `Quẻ Chủ ${maihua.mainHexagram?.name || ''} trong Dịch Học ám chỉ sự quan sát và chậm tiến triển, cho thấy tình trạng sức khỏe của bạn có thể đang bị ảnh hưởng bởi sự căng thẳng và áp lực kéo dài. Hào ${movingLine} động chỉ ra rằng vấn đề sức khỏe nằm ở tầng ${diagnostic.mapping?.movingYao?.bodyLevel || 'giữa'} của cơ thể, đặc biệt là vùng ${diagnostic.mapping?.movingYao?.anatomy?.join(', ') || 'ngực và lưng'}, có thể liên quan đến các cơ quan như ${affectedOrgan} và các tạng phủ liên quan.

Hào ${movingLine} nằm ở ${diagnostic.mapping?.movingYao?.bodyLevel || 'tầng giữa'}, cho thấy vấn đề sức khỏe tập trung ở ${diagnostic.mapping?.movingYao?.anatomy?.join(', ') || 'vùng ngực, bụng'}. Điều này có thể liên quan đến các triệu chứng như đau lưng, khó thở hoặc các vấn đề về tuần hoàn. Cơ quan liên quan bao gồm ${affectedOrgan}, ${motherOrgan}, cần được chú ý đặc biệt trong quá trình điều trị và phục hồi.

Quan hệ Thể-Dụng là ${diagnostic.expertAnalysis?.tiDung?.relation || 'tương sinh'}, cho thấy sự ${diagnostic.expertAnalysis?.tiDung?.relation === 'tương sinh' ? 'hỗ trợ' : 'mất cân bằng'} giữa các hệ thống trong cơ thể. Về sinh lý học, điều này có thể biểu hiện qua sự rối loạn tiêu hóa và căng thẳng thần kinh, ảnh hưởng đến chức năng của các cơ quan như ${affectedOrgan} và ${motherOrgan}. Cần chú ý điều hòa cảm xúc và duy trì lối sống lành mạnh.

Quẻ Biến ${maihua.changedHexagram?.name || ''} cho thấy xu hướng ${severity === 'nặng' ? 'cần theo dõi chặt chẽ' : 'ổn định'}, ${severity !== 'nặng' ? 'nhưng cần thời gian để hồi phục' : 'cần can thiệp kịp thời'}. ${maihua.changedHexagram?.name || 'Quẻ biến'} biểu thị sự ${severity === 'nặng' ? 'chuyển biến cần theo dõi' : 'mềm dẻo và khả năng thích nghi'}, cho thấy bạn có thể tự điều chỉnh nếu được chăm sóc đúng cách. Tuy nhiên, cần chú ý đến việc duy trì lối sống lành mạnh để hỗ trợ quá trình hồi phục.`;

  return {
    // THÔNG TIN CÁ NHÂN - LUÔN CHÍNH XÁC
    patientInfo: {
      subject: subject,
      gender: genderText,
      age: patientContext.age,
      pronoun: pronoun
    },
    
    summary: `Tình trạng sức khỏe hiện tại của ${pronoun} được phản ánh qua Quẻ Chủ ${maihua.mainHexagram?.name || ''} và Hào ${movingLine} động, cho thấy các vấn đề liên quan đến ${diagnostic.mapping?.movingYao?.anatomy?.join(' và ') || 'vùng cơ thể'}. Mức độ bệnh được đánh giá là ${severity}, ${seasonRelation === 'thuận' ? `mùa ${season} thuận lợi cho điều trị` : 'cần chú ý theo dõi và chăm sóc'}.`,
    
    explanation: detailedExplanation,
    
    symptoms,
    
    emotionalConnection: {
      emotion,
      organ: affectedOrgan,
      patientFeeling: `${pronoun === 'bạn' ? 'Bạn' : pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} có thể đang cảm thấy ${emotionDetail.feeling}.`,
      mechanismTCM: emotionDetail.tcmMechanism,
      mechanismModern: `Theo Y học hiện đại, ${emotion.toLowerCase()} kéo dài kích hoạt hệ thần kinh giao cảm, tăng tiết cortisol và adrenaline, gây co mạch máu, căng cơ và rối loạn chức năng ${affectedOrgan}.`,
      explanation: `${emotion} kéo dài ảnh hưởng đến ${affectedOrgan}, gây rối loạn chức năng. Cần điều hòa cảm xúc để hỗ trợ điều trị.`
    },
    
    diet: {
      shouldEat: [
        `Thực phẩm bổ ${affectedOrgan} theo ngũ hành`,
        'Rau xanh, trái cây tươi',
        'Ngũ cốc nguyên hạt',
        'Thực phẩm dễ tiêu hóa'
      ],
      shouldAvoid: [
        'Đồ cay nóng quá mức',
        'Rượu bia, chất kích thích',
        'Thức ăn nhanh, nhiều dầu mỡ'
      ],
      drinks: [
        'Nước ấm, trà thảo mộc',
        `Nước ép rau củ bổ ${affectedOrgan}`,
        'Tránh đồ uống lạnh, có ga'
      ]
    },
    
    lifestyle: [
      'Ngủ đủ giấc, trước 23h',
      'Tập thể dục nhẹ nhàng đều đặn',
      'Giảm stress, cân bằng công việc',
      'Giữ ấm cơ thể trong mùa lạnh',
      'Đi bộ 30 phút mỗi ngày',
      'Yoga hoặc thái cực quyền'
    ],
    
    prognosis: {
      outlook: severity === 'nặng' ? 'Cần theo dõi chặt chẽ' : 'Tích cực nếu tuân thủ hướng dẫn',
      recoveryTime: severity === 'nặng' ? '3-6 tháng' : '1-2 tháng',
      improvementSigns: [
        'Giảm mệt mỏi',
        'Cải thiện giấc ngủ',
        'Tăng năng lượng'
      ],
      warningSigns: [
        'Đau tăng lên',
        'Mệt mỏi kéo dài',
        'Triệu chứng không cải thiện sau 2 tuần'
      ],
      seasonalFactor: {
        currentSeason: `Mùa ${season} (${tietKhi})`,
        compatibility: seasonRelation === 'thuận' ? 'Thuận mùa' : 'Nghịch mùa',
        explanation: seasonRelation === 'thuận' 
          ? `${seasonElement} ${season} thuận lợi cho việc điều trị và phục hồi`
          : `Cần bổ trợ thêm vì ${seasonElement} không thuận với tạng bệnh`
      }
    },
    
    treatmentOrigin: {
      affectedOrgan,
      motherOrgan,
      explanation: `${affectedOrgan} (tạng bệnh) cần được bổ trợ từ ${motherOrgan} (tạng mẹ) theo quy luật ngũ hành tương sinh.`,
      treatmentDirection: `Điều trị gốc bằng cách bổ ${motherOrgan} để sinh ${affectedOrgan}.`
    },
    
    serviceRecommendations: {
      herbalMedicine: {
        recommended: seasonRelation !== 'thuận',
        reason: seasonRelation !== 'thuận' 
          ? `Nghịch mùa, cần hỗ trợ ${affectedOrgan} bằng thảo dược` 
          : 'Có thể theo dõi thêm trước khi dùng thảo dược'
      },
      acupressure: {
        recommended: true,
        reason: `Hào ${movingLine} liên quan đến ${affectedOrgan}, châm cứu giúp điều hòa khí huyết`
      },
      energyNumber: {
        recommended: seasonRelation === 'thuận' || severity !== 'nặng',
        reason: seasonRelation === 'thuận' 
          ? 'Thuận mùa, Tượng Số giúp duy trì cân bằng năng lượng'
          : `Hỗ trợ cân bằng ngũ hành cho ${affectedOrgan}`
      }
    },
    
    _isFallback: true // Flag để biết đây là fallback response
  };
}

export async function POST(req: Request) {
  try {
    const { maihua, diagnostic, patientContext } = await req.json();

    // Validate input data
    if (!maihua || !diagnostic || !patientContext) {
      console.error('[v0] Missing required data:', {
        hasMaihua: !!maihua,
        hasDiagnostic: !!diagnostic,
        hasPatientContext: !!patientContext,
      });
      return Response.json(
        {
          success: false,
          error: 'Missing required data: maihua, diagnostic, or patientContext',
        },
        { status: 400 }
      );
    }

    console.log('[v0] Starting optimized 2-layer AI analysis...');
    const startTime = Date.now();

    // ═══════════════════════════════════════════════════════════
    // TÍNH TOÁN TIẾT KHÍ TỪ HỆ THỐNG (KHÔNG ĐỂ AI TỰ ĐOÁN)
    // ═══════════════════════════════════════════════════════════
    const currentDate = new Date();
    const seasonData = getSeasonInfo(currentDate, 7.0); // Timezone Vietnam = +7
    const tiElement = diagnostic.expertAnalysis?.tiDung?.ti?.element || 'Mộc';
    const seasonAnalysis = analyzeSeasonRelation(seasonData.tietKhi.element, tiElement);
    
    const seasonInfo = {
      tietKhi: seasonData.tietKhi,
      seasonAnalysis,
      lunar: seasonData.lunar,
    };
    
    console.log('[v0] Season info:', {
      tietKhi: seasonInfo.tietKhi.name,
      season: seasonInfo.tietKhi.season,
      element: seasonInfo.tietKhi.element,
      relation: seasonInfo.seasonAnalysis.relation,
    });

    // ═══════════════════════════════════════════════════════════
    // TẦNG 1: UNIFIED MEDICAL ANALYSIS (GPT-4o)
    // Gộp Core Medical + Clinical Application
    // Temperature: 0.5 (cân bằng giữa sáng tạo và chính xác)
    // Output: Text có cấu trúc rõ ràng với tiêu đề 【】
    // ═══════════════════════════════════════════════════════════
    const layer1Start = Date.now();
    console.log('[v0] Layer 1: Medical Analysis with NEW UX-focused prompt...');
    
    // ═══════════════════════════════════════════════════════════
    // XỬ LÝ THÔNG TIN CÁ NHÂN HÓA (CRITICAL - KHÔNG ĐƯỢC SAI)
    // ═══════════════════════════════════════════════════════════
    const subjectLabels: Record<string, { label: string; pronoun: string }> = {
      'banthan': { label: 'Bản thân (người hỏi)', pronoun: 'bạn' },
      'cha': { label: 'Cha của người hỏi', pronoun: 'cha bạn' },
      'me': { label: 'Mẹ của người hỏi', pronoun: 'mẹ bạn' },
      'con': { label: 'Con của người hỏi', pronoun: 'con bạn' },
      'vo': { label: 'Vợ của người hỏi', pronoun: 'vợ bạn' },
      'chong': { label: 'Chồng của người hỏi', pronoun: 'chồng bạn' },
      'anhchiem': { label: 'Anh chị em của người hỏi', pronoun: 'anh/chị/em bạn' },
    };
    
    const subject = patientContext.subject || 'banthan';
    const subjectInfo = subjectLabels[subject] || subjectLabels['banthan'];
    const genderText = patientContext.gender === 'nam' ? 'Nam' : 'Nữ';
    const ageText = `${patientContext.age} tuổi`;
    
    console.log('[v0] Patient personalization:', {
      subject,
      gender: genderText,
      age: ageText,
      pronoun: subjectInfo.pronoun
    });

    // Build user prompt với context đầy đủ + KHÓA THÔNG TIN CÁ NHÂN
    const userPrompt = `
# ═══════════════════════════════════════════════════════════
# THÔNG TIN BỆNH NHÂN (BẮT BUỘC TUÂN THỦ - KHÔNG ĐƯỢC THAY ĐỔI)
# ═══════════════════════════════════════════════════════════
- Đối tượng hỏi: ${subjectInfo.label}
- Giới tính BỆNH NHÂN: ${genderText} (KHÔNG ĐƯỢC NHẦM)
- Tuổi BỆNH NHÂN: ${ageText} (KHÔNG ĐƯỢC NHẦM)
- Cách xưng hô: "${subjectInfo.pronoun}"
- Câu hỏi: ${patientContext.question || 'Chẩn đoán tổng quát'}

⚠️ CẢNH BÁO: Bạn PHẢI sử dụng đúng giới tính "${genderText}" và tuổi "${ageText}" trong TOÀN BỘ phân tích. Nếu viết sai giới tính hoặc tuổi, toàn bộ phân tích sẽ VÔ GIÁ TRỊ.

# KẾT QUẢ GIEO QUẺ
- Quẻ chính: ${maihua.mainHexagram?.name || 'N/A'}
- Quẻ biến: ${maihua.changedHexagram?.name || 'N/A'}
- Hào động: Hào ${maihua.movingLine || 1}
- Vị trí cơ thể: ${diagnostic.mapping?.movingYao?.anatomy?.join(', ') || 'N/A'}

# PHÂN TÍCH NGŨ HÀNH
- Tạng Thể (cơ thể): ${diagnostic.expertAnalysis?.tiDung?.ti?.element || 'N/A'}
- Tạng Dụng (bệnh): ${diagnostic.expertAnalysis?.tiDung?.dung?.element || 'N/A'}
- Quan hệ: ${diagnostic.expertAnalysis?.tiDung?.relation || 'N/A'}
- Mức độ: ${diagnostic.expertAnalysis?.tiDung?.severity || 'trung bình'}

# TIẾT KHÍ HIỆN TẠI
- Tiết khí: ${seasonInfo.tietKhi.name}
- Mùa: ${seasonInfo.tietKhi.season}
- Ngũ hành mùa: ${seasonInfo.tietKhi.element}
- Quan hệ với bệnh: ${seasonInfo.seasonAnalysis.relation}

Hãy phân tích theo cấu trúc UX-friendly đã được hướng dẫn.`;

    let layer1Result;
    const MAX_RETRIES = 2;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[v0] Layer 1 attempt ${attempt}/${MAX_RETRIES} (OpenAI Direct with NEW prompt)...`);
        layer1Result = await generateText({
          model: openai('gpt-4o'),
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.5,
          maxTokens: 2000, // Tăng lên để đủ cho format UX mới
        });
        
        // Kiểm tra response có đủ dài không
        if (layer1Result.text.length >= 500) {
          console.log(`[v0] Layer 1 success on attempt ${attempt}, length: ${layer1Result.text.length}`);
          break;
        } else {
          console.warn(`[v0] Layer 1 response too short (${layer1Result.text.length} chars), retrying...`);
          if (attempt === MAX_RETRIES) {
            console.warn('[v0] All retries exhausted, using short response');
          }
        }
      } catch (layer1Error) {
        console.error(`[v0] Layer 1 attempt ${attempt} error:`, layer1Error);
        if (attempt === MAX_RETRIES) {
          throw new Error(`Layer 1 failed after ${MAX_RETRIES} attempts: ${layer1Error instanceof Error ? layer1Error.message : 'Unknown error'}`);
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const unifiedContent = layer1Result.text;
    const layer1Time = Date.now() - layer1Start;
    console.log(`[v0] Layer 1 complete in ${layer1Time}ms, length: ${unifiedContent.length}`);
    
    // Check if Layer 1 response is too short (likely content filter or error)
    if (unifiedContent.length < 500) {
      console.warn('[v0] ═══════════════════════════════════════════════════');
      console.warn('[v0] WARNING: Layer 1 response too short!');
      console.warn(`[v0] Response length: ${unifiedContent.length} chars (min: 500)`);
      console.warn('[v0] Using FALLBACK analysis (local computation)');
      console.warn('[v0] Raw response:', unifiedContent.substring(0, 200));
      console.warn('[v0] ═══════════════════════════════════════════════════');
      
      try {
        // Sử dụng fallback analysis dựa trên dữ liệu đã có
        const fallbackAnalysis = generateFallbackAnalysis(maihua, diagnostic, patientContext, seasonInfo, subjectInfo);
        const totalTime = Date.now() - startTime;
        
        console.log(`[v0] Fallback analysis generated in ${totalTime}ms`);
        console.log('[v0] Fallback analysis keys:', Object.keys(fallbackAnalysis));
        
        return Response.json({
          success: true,
          analysis: fallbackAnalysis,
          timing: { total: totalTime, layer1: layer1Time, layer2: 0, fallback: true },
        });
      } catch (fallbackError) {
        console.error('[v0] Fallback generation error:', fallbackError);
        return Response.json({
          success: false,
          error: 'AI service unavailable and fallback failed',
          details: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // ═══════════════════════════════════════════════════════════
    // TẦNG 2: JSON FORMATTER (GROQ - FAST MODE)
    // Groq LPU: 6-10x nhanh hơn GPU thông thường
    // Model: Llama-3.3-70B - đủ tốt cho task format đơn giản
    // Temperature: 0.05 (cực thấp, tối đa deterministic)
    // Output: JSON thuần túy theo schema
    // ═══════════════════════════════════════════════════════════
    const layer2Start = Date.now();
    console.log('[v0] Layer 2: JSON Formatter (Groq Llama-3.3-70B - FAST)...');
    const jsonFormatterPrompt = buildJsonFormatterPrompt(unifiedContent);

    const layer2Result = await generateText({
      model: 'llama-3.3-70b-versatile',
      prompt: jsonFormatterPrompt,
      temperature: 0.05, // Cực thấp để tăng tính deterministic
      maxTokens: 2600, // Tăng từ 2000 để tránh sát trần khi explanation dài
    });

    const layer2Time = Date.now() - layer2Start;
    console.log(`[v0] Layer 2 complete in ${layer2Time}ms, parsing JSON...`);

    // Parse JSON response with retry logic
    let jsonText = layer2Result.text; // Corrected variable name from layer3Result to layer2Result
    
    // Try to extract JSON from markdown code block if present
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }
    
    // Try to find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[v0] No JSON found in Layer 2 response');
      throw new Error('Failed to parse AI response - no JSON found');
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[v0] JSON parse error:', parseError);
      console.error('[v0] Raw JSON text:', jsonMatch[0].substring(0, 500));
      throw new Error('Failed to parse AI response - invalid JSON');
    }

    // ═══════════════════════════════════════════════════════════
    // VALIDATION THÔNG TIN CÁ NHÂN (CRITICAL CHECK)
    // ═══════════════════════════════════════════════════════════
    if (analysis.patientInfo) {
      const expectedGender = genderText;
      const expectedAge = patientContext.age;
      const actualGender = analysis.patientInfo.gender;
      const actualAge = analysis.patientInfo.age;
      
      // Kiểm tra giới tính
      if (actualGender && actualGender !== expectedGender) {
        console.error('[v0] CRITICAL: Gender mismatch!', { expected: expectedGender, actual: actualGender });
        // Tự động sửa lại giới tính
        analysis.patientInfo.gender = expectedGender;
        console.log('[v0] Auto-corrected gender to:', expectedGender);
      }
      
      // Kiểm tra tuổi (cho phép sai lệch 1 tuổi do làm tròn)
      if (actualAge && Math.abs(actualAge - expectedAge) > 1) {
        console.error('[v0] CRITICAL: Age mismatch!', { expected: expectedAge, actual: actualAge });
        // Tự động sửa lại tuổi
        analysis.patientInfo.age = expectedAge;
        console.log('[v0] Auto-corrected age to:', expectedAge);
      }
      
      console.log('[v0] Patient info validated:', analysis.patientInfo);
    } else {
      // Nếu AI không trả về patientInfo, tự động thêm vào
      analysis.patientInfo = {
        subject: subject,
        gender: genderText,
        age: patientContext.age,
        pronoun: subjectInfo.pronoun
      };
      console.log('[v0] Patient info auto-added:', analysis.patientInfo);
    }

    // Validate required fields with detailed logging
    const requiredFields = [
      'summary',
      'explanation', 
      'symptoms',
      'emotionalConnection',
      'diet',
      'lifestyle',
      'prognosis',
      'treatmentOrigin',
      'serviceRecommendations'
    ];
    
    const missingFields = requiredFields.filter(field => !analysis[field]);
    
    if (missingFields.length > 0) {
      console.error('[v0] Missing required fields:', missingFields);
      console.error('[v0] Available fields:', Object.keys(analysis));
      
      // Provide fallback for emotionalConnection if missing
      if (!analysis.emotionalConnection) {
        const upperElement = diagnostic.mapping?.upperTrigram?.element || 'Mộc';
        const emotionMap: Record<string, string> = {
          'Mộc': 'Giận dữ, căng thẳng',
          'Hỏa': 'Hưng phấn quá độ, lo âu',
          'Thổ': 'Lo nghĩ, suy tư nhiều',
          'Kim': 'Buồn bã, u sầu',
          'Thủy': 'Sợ hãi, bất an'
        };
        const organMap: Record<string, string> = {
          'Mộc': 'Gan',
          'Hỏa': 'Tâm',
          'Thổ': 'Tỳ',
          'Kim': 'Phổi',
          'Thủy': 'Thận'
        };
        
        analysis.emotionalConnection = {
          emotion: emotionMap[upperElement] || 'Căng thẳng',
          organ: organMap[upperElement] || 'Gan',
          patientFeeling: `${subjectInfo.pronoun === 'bạn' ? 'Bạn' : subjectInfo.pronoun.charAt(0).toUpperCase() + subjectInfo.pronoun.slice(1)} có thể đang trải qua cảm xúc tiêu cực ảnh hưởng đến sức khỏe.`,
          mechanismTCM: `Cảm xúc ảnh hưởng đến ${organMap[upperElement]}, gây rối loạn khí huyết.`,
          mechanismModern: 'Căng thẳng kéo dài kích hoạt hệ thần kinh giao cảm, tăng cortisol, ảnh hưởng đến các cơ quan nội tạng.'
        };
        console.log('[v0] Auto-added emotionalConnection');
      }
      
      // Provide fallback for prognosis if missing
      if (!analysis.prognosis) {
        const severity = diagnostic.expertAnalysis?.tiDung?.severity || 'trung bình';
        analysis.prognosis = {
          outlook: severity === 'nặng' ? 'Cần theo dõi chặt chẽ' : 'Tích cực nếu tuân thủ hướng dẫn',
          recoveryTime: severity === 'nặng' ? '3-6 tháng' : '1-2 tháng',
          improvementSigns: [
            'Giảm mệt mỏi, tăng năng lượng',
            'Cải thiện giấc ngủ và cảm xúc',
            'Triệu chứng giảm dần theo thời gian'
          ],
          warningSigns: [
            'Triệu chứng tăng lên hoặc không cải thiện sau 2 tuần',
            'Xuất hiện triệu chứng mới hoặc nghiêm trọng hơn',
            'Ảnh hưởng đến sinh hoạt hàng ngày'
          ]
        };
        console.log('[v0] Auto-added prognosis');
      }
      
      // If only missing some optional fields, provide defaults instead of failing
      if (!analysis.serviceRecommendations) {
        analysis.serviceRecommendations = {
          herbalMedicine: { recommended: false, reason: 'Chưa xác định' },
          acupressure: { recommended: false, reason: 'Chưa xác định' },
          energyNumber: { recommended: true, reason: 'Phù hợp với phân tích quẻ tượng' }
        };
        console.log('[v0] Auto-added serviceRecommendations');
      }
      
      if (!analysis.treatmentOrigin) {
        analysis.treatmentOrigin = {
          affectedOrgan: 'Chưa xác định',
          motherOrgan: 'Chưa xác định',
          explanation: 'Cần phân tích thêm',
          treatmentDirection: 'Tham vấn chuyên gia'
        };
        console.log('[v0] Auto-added treatmentOrigin');
      }
      
      // Only throw if critical fields are missing
      if (!analysis.summary || !analysis.explanation) {
        throw new Error('Failed to parse AI response - missing critical fields');
      }
    }

    const totalTime = Date.now() - startTime;
    console.log('[v0] ═══════════════════════════════════════════════════');
    console.log(`[v0] HYBRID AI Complete! Total: ${totalTime}ms`);
    console.log(`[v0] ├── Layer 1 (OpenAI Direct GPT-4o): ${layer1Time}ms`);
    console.log(`[v0] └── Layer 2 (Groq Llama-3.3-70B): ${layer2Time}ms`);
    console.log('[v0] ═══════════════════════════════════════════════════');

    return Response.json({
      success: true,
      analysis,
      timing: {
        total: totalTime,
        layer1: layer1Time,
        layer2: layer2Time,
        models: {
          layer1: 'OpenAI GPT-4o Direct (No Gateway)',
          layer2: 'Groq Llama-3.3-70B (Fast JSON)',
        },
      },
    });
  } catch (error) {
    console.error('[v0] AI analysis error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export function parseJobDescription(description) {
  if (!description || typeof description !== 'string') {
    return {};
  }

  const text = description.toLowerCase();
  const result = {};

  // Extract company name - prioritize first line or "About Us:" pattern
  // First, try to get the very first word/phrase (often the company name)
  const firstLineMatch = description.match(/^([A-Z][A-Za-z0-9\s&.,-]+?)(?:\s+\n|\n|$)/);
  if (firstLineMatch && firstLineMatch[1]) {
    const firstCompany = firstLineMatch[1].trim();
    // Check if it's a reasonable company name (not too long, not common words)
    if (firstCompany.length > 1 && firstCompany.length < 50 && 
        !firstCompany.match(/^(the|a|an|we|our|your|united|states|about|job|position)$/i) &&
        !firstCompany.includes('·') && !firstCompany.includes('ago')) {
      result.company = firstCompany;
    }
  }
  
  // If not found, try "About Us:" pattern
  if (!result.company) {
    const aboutUsPattern = /about\s+us[:\s]+([A-Z][A-Za-z0-9\s&.,-]+?)(?:\s+is|\s+seeks|,|\.|\n|$)/i;
    const match = description.match(aboutUsPattern);
    if (match && match[1]) {
      const company = match[1].trim();
      if (company.length > 1 && company.length < 50) {
        result.company = company;
      }
    }
  }
  
  // Fallback to other patterns
  if (!result.company) {
    const companyPatterns = [
      /(?:at|with|from|join)\s+([A-Z][A-Za-z0-9\s&.,-]+?)(?:\s+is|\s+seeks|\s+looking|\s+hiring|,|\.|$|\n)/,
      /^([A-Z][A-Za-z0-9\s&.,-]+?)\s+(?:is|seeks|looking|hiring|a|an)/,
      /company[:\s]+([A-Z][A-Za-z0-9\s&.,-]+?)(?:\n|$|,|\.)/i,
    ];
    for (const pattern of companyPatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        // Filter out common false positives and skip if it contains common job listing words
        if (company.length > 1 && company.length < 50 && 
            !company.match(/^(the|a|an|we|our|your|united|states)$/i) &&
            !company.toLowerCase().includes('university') && 
            !company.toLowerCase().includes('school')) {
          result.company = company;
          break;
        }
      }
    }
  }

  // Extract job title - prioritize second line (often right after company name)
  // First, try to get text on the second line (after company name)
  const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length >= 2) {
    const secondLine = lines[1];
    // Check if second line looks like a job title (contains job-related words, not too long)
    if (secondLine.length > 3 && secondLine.length < 100 && 
        !secondLine.match(/^(united|states|days?|ago|applicants?|promoted|actively|reviewing)$/i) &&
        !secondLine.includes('·') && 
        (secondLine.match(/\b(engineer|developer|manager|analyst|designer|specialist|coordinator|director|lead|senior|junior|intern|assistant|executive|officer|representative|associate|consultant|architect|programmer|technician)\b/i) ||
         secondLine.match(/\(/))) { // Has parentheses (often part of job titles)
      result.jobTitle = secondLine;
    }
  }
  
  // If not found, try other patterns
  if (!result.jobTitle) {
    const titlePatterns = [
      /(?:job\s+title|position|role|title|opening)[:]\s*([^\n]+?)(?:\n|$)/i,
      /(?:we\s+are\s+hiring|looking\s+for|seeking|hiring)\s+(?:a|an)?\s*([A-Z][A-Za-z\s()]+?)(?:\s+developer|\s+engineer|\s+manager|\s+analyst|\s+designer|\s+specialist|\.|,|\n|$)/i,
      /^([A-Z][A-Za-z\s()]+?)\s+(?:developer|engineer|manager|analyst|designer|specialist|coordinator|director|lead|senior|junior)/i,
      /(?:position|role)[:\s]+([A-Z][A-Za-z\s()]+?)(?:\n|$|,|\.)/i,
    ];
    for (const pattern of titlePatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        const title = match[1].trim();
        if (title.length > 2 && title.length < 100) {
          result.jobTitle = title;
          break;
        }
      }
    }
  }

  // Extract pay range - handle various formats including "K/yr"
  const payPatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*\/\s*yr\s*[-–—]\s*\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*\/\s*yr/i,
    /\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*\$(\d{1,3}(?:,\d{3})*(?:k|K)?)/,
    /(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*(?:per\s+year|annually|per\s+hour|hourly|yr|year)/i,
    /salary[:\s]+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /compensation[:\s]+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /ranges?\s+from\s+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s+to\s+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*(?:dollars?|USD)/i,
  ];
  for (const pattern of payPatterns) {
    const match = description.match(pattern);
    if (match) {
      let min = match[1].replace(/[^0-9kK]/g, '');
      let max = match[2] ? match[2].replace(/[^0-9kK]/g, '') : '';
      
      // Normalize k/K to lowercase k
      if (min.toLowerCase().endsWith('k')) {
        min = min.slice(0, -1).toLowerCase() + 'k';
      } else {
        min = min.toLowerCase();
      }
      if (max && max.toLowerCase().endsWith('k')) {
        max = max.slice(0, -1).toLowerCase() + 'k';
      } else if (max) {
        max = max.toLowerCase();
      }
      
      result.payRange = max ? `$${min} - $${max}` : `$${min}`;
      break;
    }
  }

  // Extract employment type
  if (text.includes('full-time') || text.includes('full time')) {
    result.employmentType = 'Full-time';
  } else if (text.includes('part-time') || text.includes('part time')) {
    result.employmentType = 'Part-time';
  } else if (text.includes('contract')) {
    result.employmentType = 'Contract';
  } else if (text.includes('internship') || text.includes('intern')) {
    result.employmentType = 'Internship';
  }

  // Extract benefits - look for specific benefit items, not entire paragraphs
  const benefitsList = [];
  
  // Look for "Benefits found in job post" section (common in LinkedIn)
  const benefitsFoundMatch = description.match(/benefits?\s+found\s+in\s+job\s+post[:\s]+([^\n]+)/i);
  if (benefitsFoundMatch) {
    const benefitsText = benefitsFoundMatch[1];
    // Extract individual benefits (comma-separated or listed)
    const individualBenefits = benefitsText.split(/[,•\n]/).map(b => b.trim()).filter(b => b.length > 0);
    benefitsList.push(...individualBenefits);
  }
  
  // Look for numbered benefits list (1. Medical, 2. Dental, etc.)
  const numberedBenefits = description.match(/(?:\d+\.\s*)([A-Z][^\n]+?)(?=\d+\.|$)/gi);
  if (numberedBenefits) {
    numberedBenefits.forEach(benefit => {
      const cleanBenefit = benefit.replace(/^\d+\.\s*/, '').trim();
      if (cleanBenefit.length > 0 && cleanBenefit.length < 100) {
        // Only add if it looks like a benefit name, not a full sentence
        if (cleanBenefit.match(/\b(insurance|401k|pto|time\s+off|sick\s+leave|dental|vision|medical|retirement|stock|options?|bonus|vacation|holiday)\b/i)) {
          benefitsList.push(cleanBenefit.split('.')[0].trim()); // Take first sentence only
        }
      }
    });
  }
  
  // Look for bulleted benefits
  const bulletedBenefits = description.match(/(?:[-•*]\s*)([A-Z][^\n]+?)(?=\n|$)/g);
  if (bulletedBenefits) {
    bulletedBenefits.forEach(benefit => {
      const cleanBenefit = benefit.replace(/^[-•*]\s*/, '').trim();
      if (cleanBenefit.length > 0 && cleanBenefit.length < 100 &&
          cleanBenefit.match(/\b(insurance|401k|pto|time\s+off|sick\s+leave|dental|vision|medical|retirement|stock|options?|bonus|vacation|holiday)\b/i)) {
        benefitsList.push(cleanBenefit.split('.')[0].trim());
      }
    });
  }
  
  // If we found specific benefits, use them; otherwise fall back to general pattern
  if (benefitsList.length > 0) {
    // Remove duplicates and format
    const uniqueBenefits = [...new Set(benefitsList.map(b => b.charAt(0).toUpperCase() + b.slice(1).toLowerCase()))];
    result.benefits = uniqueBenefits.join(', ');
  } else {
    // Fallback to general benefits section
    const benefitsPatterns = [
      /benefits?\s+found\s+in\s+job\s+post[:\s]+([^\n]+)/i,
      /benefits?[:\s]+([^\n]+(?:\n[^\n]+){0,5})/i,
    ];
    for (const pattern of benefitsPatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        let benefits = match[1].trim();
        // Clean up and limit length
        benefits = benefits.replace(/\n{3,}/g, '\n\n');
        result.benefits = benefits.substring(0, 200);
        break;
      }
    }
  }

  // Extract job link (look for URLs - prioritize job board URLs)
  const urlPatterns = [
    /(https?:\/\/[^\s\)]+(?:linkedin|indeed|glassdoor|monster|ziprecruiter|dice|stackoverflow|github|lever|greenhouse|workday)[^\s\)]+)/i,
    /(https?:\/\/[^\s\)]+)/i,
  ];
  for (const pattern of urlPatterns) {
    const urlMatch = description.match(pattern);
    if (urlMatch) {
      result.jobLink = urlMatch[1];
      break;
    }
  }

  return result;
}


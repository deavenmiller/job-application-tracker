export function parseJobDescription(description) {
  if (!description || typeof description !== 'string') {
    return {};
  }

  const text = description.toLowerCase();
  const result = {};

  // Extract company name (look for patterns like "at [Company]", "[Company] is", etc.)
  const companyPatterns = [
    /(?:at|with|from|join)\s+([A-Z][A-Za-z0-9\s&.,-]+?)(?:\s+is|\s+seeks|\s+looking|\s+hiring|,|\.|$|\n)/,
    /^([A-Z][A-Za-z0-9\s&.,-]+?)\s+(?:is|seeks|looking|hiring|a|an)/,
    /company[:\s]+([A-Z][A-Za-z0-9\s&.,-]+?)(?:\n|$|,|\.)/i,
    /organization[:\s]+([A-Z][A-Za-z0-9\s&.,-]+?)(?:\n|$|,|\.)/i,
  ];
  for (const pattern of companyPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const company = match[1].trim();
      // Filter out common false positives
      if (company.length > 1 && company.length < 50 && !company.match(/^(the|a|an|we|our|your)$/i)) {
        result.company = company;
        break;
      }
    }
  }

  // Extract job title (look for patterns like "Job Title:", "Position:", "Role:", etc.)
  const titlePatterns = [
    /(?:job\s+title|position|role|title|opening)[:]\s*([^\n]+?)(?:\n|$)/i,
    /(?:we\s+are\s+hiring|looking\s+for|seeking|hiring)\s+(?:a|an)?\s*([A-Z][A-Za-z\s]+?)(?:\s+developer|\s+engineer|\s+manager|\s+analyst|\s+designer|\s+specialist|\.|,|\n|$)/i,
    /^([A-Z][A-Za-z\s]+?)\s+(?:developer|engineer|manager|analyst|designer|specialist|coordinator|director|lead|senior|junior)/i,
    /(?:position|role)[:\s]+([A-Z][A-Za-z\s]+?)(?:\n|$|,|\.)/i,
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

  // Extract pay range
  const payPatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*\$(\d{1,3}(?:,\d{3})*(?:k|K)?)/,
    /(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*(?:per\s+year|annually|per\s+hour|hourly|yr|year)/i,
    /salary[:\s]+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /compensation[:\s]+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /pay[:\s]+(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\$?\d{1,3}(?:,\d{3})*(?:k|K)?)/i,
    /(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*(?:dollars?|USD)/i,
  ];
  for (const pattern of payPatterns) {
    const match = description.match(pattern);
    if (match) {
      let min = match[1].replace(/[^0-9kK]/g, '');
      let max = match[2] ? match[2].replace(/[^0-9kK]/g, '') : '';
      
      // Normalize k/K to thousands
      if (min.toLowerCase().endsWith('k')) {
        min = min.slice(0, -1) + 'k';
      }
      if (max && max.toLowerCase().endsWith('k')) {
        max = max.slice(0, -1) + 'k';
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

  // Extract benefits (look for benefits section)
  const benefitsPatterns = [
    /benefits?[:\s]+([^\n]+(?:\n[^\n]+){0,15})/i,
    /what\s+we\s+offer[:\s]+([^\n]+(?:\n[^\n]+){0,15})/i,
    /perks?[:\s]+([^\n]+(?:\n[^\n]+){0,15})/i,
    /compensation\s+and\s+benefits?[:\s]+([^\n]+(?:\n[^\n]+){0,15})/i,
  ];
  for (const pattern of benefitsPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      let benefits = match[1].trim();
      // Clean up the benefits text
      benefits = benefits.replace(/\n{3,}/g, '\n\n');
      result.benefits = benefits.substring(0, 500); // Limit length
      break;
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


const CONTRIBUTIONS = `
42 125 248 84 250 496 126 376 744 168 501 991 210 626 1239
46 137 271 92 274 543 138 411 814 183 545 1080 228 679 1346
50 149 295 100 298 590 150 447 885 198 590 1169 248 739 1464
54 161 319 108 322 637 162 483 956 215 641 1269 269 802 1588
59 176 348 117 349 690 177 527 1045 234 697 1381 292 870 1723
64 191 378 127 378 749 192 572 1133 254 757 1499 318 948 1877
70 209 413 139 414 820 208 620 1228 277 826 1635 346 1031 2042
76 226 449 151 450 891 226 674 1334 301 897 1776 376 1121 2219
82 244 484 164 489 968 246 733 1452 327 975 1930 409 1219 2414
90 268 531 178 530 1050 268 799 1582 356 1061 2101 446 1329 2632
97 289 572 194 578 1145 292 870 1723 388 1156 2290 485 1445 2862
106 316 626 212 632 1251 318 948 1877 423 1261 2496 529 1577 3122
116 346 685 231 688 1363 347 1034 2048 462 1377 2727 577 1720 3405
126 376 744 252 751 1487 379 1129 2237 504 1502 2974 630 1878 3718
138 411 814 276 823 1629 414 1234 2443 551 1642 3252 689 2053 4066
151 450 891 302 900 1782 453 1350 2673 602 1794 3553 752 2241 4438
165 492 974 330 983 1948 495 1475 2921 659 1964 3889 824 2456 4863
181 539 1068 362 1079 2136 543 1618 3205 722 2152 4261 902 2688 5323
198 590 1169 396 1180 2337 594 1770 3506 792 2360 4674 990 2950 5843
218 650 1287 436 1299 2573 654 1949 3860 870 2593 5134 1087 3239 6415
240 715 1416 480 1430 2833 720 2146 4249 957 2852 5648 1196 3564 7058
264 787 1558 528 1574 3116 792 2360 4674 1054 3141 6220 1318 3928 7778
291 867 1717 582 1734 3435 873 2602 5152 1164 3469 6869 1454 4333 8581
`.trim().split(/\s+/u).map(Number);
const PENSIONS = Object.freeze([1000, 2000, 3000, 4000, 5000]);
const FREQUENCIES = Object.freeze(['monthly', 'quarterly', 'half-yearly']);

export function getApyContribution(entryAge, pension, frequency = 'monthly') {
  if (!Number.isInteger(entryAge) || entryAge < 18 || entryAge > 40) throw new RangeError('APY entry age must be a whole number from 18 to 40.');
  const pensionIndex = PENSIONS.indexOf(pension);
  const frequencyIndex = FREQUENCIES.indexOf(frequency);
  if (pensionIndex < 0 || frequencyIndex < 0) throw new RangeError('Choose a listed APY pension and contribution frequency.');
  const row = entryAge - 18;
  const contribution = CONTRIBUTIONS[row * 15 + pensionIndex * 3 + frequencyIndex];
  const vestingYears = 60 - entryAge;
  const periodsPerYear = frequencyIndex === 0 ? 12 : frequencyIndex === 1 ? 4 : 2;
  return Object.freeze({ entryAge, pension, frequency, contribution, vestingYears, paymentCount: vestingYears * periodsPerYear, nominalContributions: contribution * vestingYears * periodsPerYear });
}

export const APY_OPTIONS = Object.freeze({ pensions: PENSIONS, frequencies: FREQUENCIES, tableVerified: '2026-10-19' });

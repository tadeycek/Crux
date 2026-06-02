import { useState } from 'react'
import { BrainIcon, DotIcon } from '../icons'
import type { ApiProblemDetail } from '../../lib/api'
import { useLanguage } from '../../lib/useLanguage'
import { useSession } from '../../lib/useSession'

const DIFFICULTY_STYLES = {
  easy:   { label: 'Easy',   color: 'var(--ok)',     bg: 'var(--diff-easy-bg)',  border: 'var(--diff-easy-border)' },
  medium: { label: 'Medium', color: 'var(--warn)',   bg: 'var(--diff-med-bg)',   border: 'var(--diff-med-border)'  },
  hard:   { label: 'Hard',   color: 'var(--danger)', bg: 'var(--diff-hard-bg)',  border: 'var(--diff-hard-border)' },
}

function DifficultyBadge({ level }: { level: ApiProblemDetail['difficulty'] }) {
  const s = DIFFICULTY_STYLES[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 8px 2px 6px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 500,
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
    }}>
      <span style={{ display: 'inline-flex', color: s.color }}><DotIcon /></span>
      {s.label}
    </span>
  )
}

const TABS = ['Description', 'Editorial', 'Solutions', 'Submissions'] as const
type Tab = typeof TABS[number]

interface ProblemPanelProps {
  problem: ApiProblemDetail
  onBack: () => void
}

export function ProblemPanel({ problem, onBack }: ProblemPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Description')

  return (
    <aside style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-1)', minHeight: 0,
    }}>
      {/* tabs */}
      <div style={{
        display: 'flex', gap: 2, padding: '4px 8px 0',
        borderBottom: '1px solid var(--border-soft)',
        background: 'var(--bg-1)',
        alignItems: 'center',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--fg-4)', fontSize: 13, padding: '6px 6px 6px 2px',
            marginRight: 4, display: 'inline-flex', alignItems: 'center',
          }}
          title="Back to problem list"
        >
          ←
        </button>
        {TABS.map((tab) => {
          const isActive = tab === activeTab
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: isActive ? 'var(--fg)' : 'var(--fg-3)',
              padding: '8px 10px',
              fontSize: 12.5, fontWeight: 500,
              borderBottom: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              marginBottom: -1,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {tab}
            </button>
          )
        })}
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 22px 28px' }}>
        {activeTab === 'Description' && <DescriptionContent problem={problem} />}
        {activeTab === 'Editorial' && <EditorialContent problem={problem} />}
        {activeTab === 'Solutions' && <SolutionsContent problem={problem} />}
        {activeTab === 'Submissions' && <SubmissionsContent problem={problem} />}
      </div>
    </aside>
  )
}

function DescriptionContent({ problem }: { problem: ApiProblemDetail }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-4)',
        letterSpacing: '0.04em',
      }}>
        <span>
          <span style={{ opacity: 0.6 }}>#</span>{String(problem.id).padStart(4, '0')}
        </span>
        <span style={{ flex: '0 0 24px', height: 1, background: 'var(--border)' }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--fg-3)', textTransform: 'uppercase',
          letterSpacing: '0.07em', fontSize: 10.5,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 0 3px oklch(0.5 0.14 278 / 0.18)',
          }} />
          In progress
        </span>
      </div>

      <h1 style={{
        margin: '4px 0 6px', fontSize: 22, fontWeight: 600,
        letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.2,
      }}>
        {problem.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
        <DifficultyBadge level={problem.difficulty} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {problem.topics.map((t) => (
            <span key={t.slug} style={{
              fontSize: 11.5, fontWeight: 500, color: 'var(--fg-2)',
              background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
              padding: '2px 8px', borderRadius: 999,
            }}>
              {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 10 }}>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
          {problem.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {problem.examples.map((ex, i) => (
            <div key={i} style={{
              background: 'var(--bg-inset)', border: '1px solid var(--border-soft)',
              borderRadius: 9, padding: '12px 13px',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 10.5,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--fg-4)', marginBottom: 8,
              }}>
                Example {i + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { key: 'Input', val: ex.input, mono: true },
                  { key: 'Output', val: ex.output, mono: true },
                  { key: 'Explanation', val: ex.explain, mono: false },
                ].map(({ key, val, mono }) => (
                  <div key={key} style={{
                    display: 'grid', gridTemplateColumns: '84px 1fr',
                    alignItems: 'baseline', gap: 8,
                  }}>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-4)', fontWeight: 500 }}>{key}</span>
                    {mono ? (
                      <code style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--fg)' }}>{val}</code>
                    ) : (
                      <span style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>{val}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10.5,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--fg-4)', marginBottom: 6,
          }}>
            Constraints
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {problem.constraints.split('\n').filter(Boolean).map((c, i) => (
              <li key={i} style={{ color: 'var(--fg-2)', fontSize: 12.5 }}>
                <InlineCode>{c.replace(/^- /, '')}</InlineCode>
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          marginTop: 4,
          border: '1px solid var(--tutor-mode-border)',
          background: 'var(--tutor-mode-overlay), var(--bg-1)',
          borderRadius: 10, padding: '12px 14px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontWeight: 600, color: 'var(--accent-fg)',
            fontSize: 12.5, marginBottom: 4, letterSpacing: '-0.005em',
          }}>
            <span style={{ color: 'var(--accent)' }}><BrainIcon /></span>
            Tutor mode is on
          </div>
          <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.55 }}>
            Crux won't show you the solution. Ask away — it'll question you back until{' '}
            <em style={{ color: 'var(--fg)', fontStyle: 'italic' }}>you</em> see the answer.
          </p>
        </div>
      </div>
    </div>
  )
}

const PROBLEM_EDITORIALS: Record<string, { intuition: string; steps: string[]; pitfalls: string[]; target: string }> = {
  'two-sum': {
    intuition: "Instead of comparing every pair of numbers which takes quadratic O(n²) time, we can look for the 'complement' (target - current_number) on the fly. How can we check if we've seen this complement before in constant time?",
    steps: [
      "Initialize an empty hash map to store each number and its corresponding array index.",
      "Iterate through the array. For each element at index i, calculate its complement: complement = target - nums[i].",
      "Check if this complement exists in our map. If it does, we found the pair! Return [map[complement], i].",
      "If it does not exist, insert the current number and index into the map: map[nums[i]] = i."
    ],
    pitfalls: [
      "Using the same element twice (e.g., if target is 6 and the number is 3, make sure you don't match 3 with itself).",
      "Handling duplicate numbers in the array correctly."
    ],
    target: "Time Complexity: O(n) — one single pass through the array.\nSpace Complexity: O(n) — for storing elements in the hash map."
  },
  'valid-palindrome': {
    intuition: "A palindrome reads the same from left to right. Can we use two indices, one starting at the beginning and one at the end, and converge them inward, checking that characters match at each step?",
    steps: [
      "Set two pointer variables: left = 0 and right = string.length - 1.",
      "While left is less than right, check characters at both indices.",
      "If the left character is non-alphanumeric, skip it by incrementing left.",
      "If the right character is non-alphanumeric, skip it by decrementing right.",
      "Compare both characters case-insensitively. If they differ, return False.",
      "Increment left and decrement right, and continue."
    ],
    pitfalls: [
      "Forgetting to handle strings that are empty or contain only non-alphanumeric characters (should return True).",
      "Case sensitivity checks."
    ],
    target: "Time Complexity: O(n) — we check each character at most once.\nSpace Complexity: O(1) — only pointers are stored."
  },
  'best-time-to-buy-and-sell-stock': {
    intuition: "If we must buy before we sell, we only care about the lowest price we could have bought at prior to today. What if we keep track of the minimum price we've seen so far, and calculate the maximum profit we can get on any subsequent day?",
    steps: [
      "Initialize min_price to positive infinity and max_profit to 0.",
      "Iterate through the stock prices list.",
      "On each price, if it is smaller than our min_price, update min_price.",
      "Otherwise, calculate the profit: price - min_price. If this profit exceeds our max_profit, update max_profit."
    ],
    pitfalls: [
      "Trying to sell before buying (e.g., picking a price at index 0 to sell and index 3 to buy).",
      "Handling arrays with fewer than two elements."
    ],
    target: "Time Complexity: O(n) — single linear pass.\nSpace Complexity: O(1) — constant storage variables."
  }
}

function EditorialContent({ problem }: { problem: ApiProblemDetail }) {
  const ed = PROBLEM_EDITORIALS[problem.slug] ?? {
    intuition: "To solve this problem efficiently, think about how you can reduce the brute-force search space. Can you use a hash map, a sorting pre-pass, or two pointers to optimize your searches?",
    steps: [
      "Understand the input format and outline the base cases (e.g., empty arrays, single inputs).",
      "Iterate through the container and keep track of state variables using appropriate auxiliary structures.",
      "Validate the constraint boundaries at each state change."
    ],
    pitfalls: [
      "Boundary constraints (empty ranges, overflow boundaries).",
      "Out of bound index operations."
    ],
    target: "Time Complexity: O(n log n) or O(n)\nSpace Complexity: O(n) or O(1)"
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>The Socratic Intuition</h3>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {ed.intuition}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 14 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Guided Algorithmic Steps</h3>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ed.steps.map((s, i) => (
            <li key={i} style={{ color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.55 }}>{s}</li>
          ))}
        </ol>
      </div>

      <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 14 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>Common Pitfalls to Avoid</h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ed.pitfalls.map((p, i) => (
            <li key={i} style={{ color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.5 }}>{p}</li>
          ))}
        </ul>
      </div>

      <div style={{
        borderTop: '1px solid var(--border-soft)', paddingTop: 14,
        fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-3)',
      }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--sans)' }}>Target Complexity</h3>
        <pre style={{ margin: 0, background: 'var(--bg-inset)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-soft)', fontSize: 12, lineHeight: 1.5, color: 'var(--accent-fg)' }}>
          {ed.target}
        </pre>
      </div>
    </div>
  )
}

const PROBLEM_SOLUTIONS: Record<string, Record<string, string>> = {
  'two-sum': {
    python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`
  },
  'valid-palindrome': {
    python: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    javascript: `function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
        left++;
        right--;
    }
    return true;
}`,
    java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}`,
    cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};`
  },
  'best-time-to-buy-and-sell-stock': {
    python: `def max_profit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
    javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (const price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}`,
    java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
}`,
    cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
};`
  }
}

function SolutionsContent({ problem }: { problem: ApiProblemDetail }) {
  const { language } = useLanguage()
  const sol = PROBLEM_SOLUTIONS[problem.slug]?.[language] ?? `// Best solution template in ${language}
// (Write Socratic solution here or ask tutor for guidance)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Optimal Solution ({language})</span>
        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>O(n) time · O(1) space</span>
      </div>
      <pre style={{
        margin: 0, padding: '14px 16px',
        background: 'var(--bg-inset)',
        border: '1px solid var(--border-soft)',
        borderRadius: 9,
        fontFamily: 'var(--mono)', fontSize: 12,
        color: 'var(--fg)', lineHeight: 1.6,
        overflowX: 'auto', whiteSpace: 'pre',
      }}>
        <code>{sol}</code>
      </pre>
    </div>
  )
}

function SubmissionsContent({ problem }: { problem: ApiProblemDetail }) {
  const { session } = useSession(problem.id)
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Session Runs</span>
        <span style={{ fontSize: 11.5, color: 'var(--fg-4)', textTransform: 'capitalize' }}>Status: {session?.status ?? 'active'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
          borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg)' }}>Save current code state</div>
            <div style={{ fontSize: 11, color: 'var(--fg-4)', marginTop: 2, fontFamily: 'var(--mono)' }}>
              {session?.startedAt ? new Date(session.startedAt).toLocaleString() : 'Just now'}
            </div>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ok)' }}>SUCCESS</span>
        </div>

        <div style={{
          background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
          borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          opacity: 0.65,
        }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Initial checkout sandbox</div>
            <div style={{ fontSize: 11, color: 'var(--fg-4)', marginTop: 2, fontFamily: 'var(--mono)' }}>
              Session initialized
            </div>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-3)' }}>SYSTEM</span>
        </div>
      </div>
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'var(--mono)', fontSize: 12,
      background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
      padding: '1px 6px', borderRadius: 5, color: 'var(--fg)',
    }}>
      {children}
    </code>
  )
}


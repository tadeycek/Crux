export type ConceptDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type ConceptCategory =
  | 'arrays'
  | 'hash-maps'
  | 'trees'
  | 'graphs'
  | 'sorting'
  | 'recursion'
  | 'foundations'
  | 'heaps'
  | 'tries'
  | 'greedy'
  | 'bit-manipulation'
  | 'union-find'
  | 'oop'
  | 'operating-systems'
  | 'databases'
  | 'networks'
  | 'system-design'
  | 'paradigms'
export type ConceptTrack = 'foundations' | 'data-structures' | 'algorithms' | 'advanced' | 'core-cs'

// Per-code-block, per-language overrides. Index matches the code block's
// position in `body` (0-based). Falls back to the Python in `body` if missing.
export type CodeByLang = Array<{ python?: string; javascript?: string; java?: string; cpp?: string }>

export interface ConceptSection {
  heading: string
  body: string // plain text + ```lang fenced code blocks (Python as default)
  codeByLang?: CodeByLang
}

export const TRACKS: { id: ConceptTrack; label: string; description: string }[] = [
  { id: 'foundations',      label: 'Foundations',      description: 'What algorithms are, how to measure them, and the building block you use most.' },
  { id: 'data-structures',  label: 'Data Structures',  description: 'The containers your algorithms operate on — master these first.' },
  { id: 'algorithms',       label: 'Algorithms',       description: 'Core problem-solving patterns that appear in 80% of interview questions.' },
  { id: 'advanced',         label: 'Advanced',         description: 'Harder techniques that require a solid grasp of everything above.' },
  { id: 'core-cs',          label: 'Core CS Foundations', description: 'Academic fundamentals: Object-Oriented Design, Database design, Operating Systems, Networks.' },
]

export interface Concept {
  slug: string
  title: string
  track: ConceptTrack
  trackOrder: number    // position within the track (1-based)
  category: ConceptCategory
  categoryLabel: string
  difficulty: ConceptDifficulty
  summary: string
  timeEstimate: number // minutes
  content: ConceptSection[]
  relatedProblems: string[] // problem slugs
}

export const CONCEPTS: Concept[] = [
  // ── Foundations ──────────────────────────────────────────────────────────
  {
    slug: 'what-is-an-algorithm',
    title: 'What is an Algorithm?',
    track: 'foundations',
    trackOrder: 1,
    category: 'foundations',
    categoryLabel: 'Foundations',
    difficulty: 'beginner',
    summary: 'Understand what algorithms are, why they matter, and solve your first one from scratch.',
    timeEstimate: 8,
    relatedProblems: ['two-sum'],
    content: [
      {
        heading: 'Definition',
        body: `An algorithm is a finite, ordered sequence of instructions that takes some input, processes it, and produces an output.

Think of a recipe: you start with ingredients (input), follow steps in a specific order, and end up with a dish (output). The recipe is the algorithm.

Three things every algorithm must have:
• Input — zero or more values it receives
• Output — at least one result it produces
• Termination — it must stop after a finite number of steps`,
      },
      {
        heading: 'A Concrete Example',
        body: `Problem: find the largest number in a list.

Naive approach — look at every number and keep track of the biggest one seen so far.

\`\`\`python
def find_max(nums):
    biggest = nums[0]          # start with the first element
    for n in nums[1:]:         # check the rest
        if n > biggest:
            biggest = n
    return biggest
\`\`\`

Walk through [3, 7, 1, 9, 4]:
1. biggest = 3
2. 7 > 3 → biggest = 7
3. 1 > 7? No
4. 9 > 7 → biggest = 9
5. 4 > 9? No
Result: 9 ✓`,
        codeByLang: [
          {
            javascript: `function findMax(nums) {
    let biggest = nums[0];        // start with the first element
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > biggest) biggest = nums[i];
    }
    return biggest;
}`,
            java: `int findMax(int[] nums) {
    int biggest = nums[0];        // start with the first element
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > biggest) biggest = nums[i];
    }
    return biggest;
}`,
            cpp: `int findMax(vector<int>& nums) {
    int biggest = nums[0];        // start with the first element
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] > biggest) biggest = nums[i];
    }
    return biggest;
}`,
          },
        ],
      },
      {
        heading: 'Correctness vs Efficiency',
        body: `A correct algorithm always produces the right answer. An efficient algorithm does it quickly and with little memory.

Both matter. A slow-but-correct algorithm is usable. A fast-but-wrong algorithm is worthless.

When you write your first version, focus on correctness. Once it works, think about whether it's fast enough. This is called the "make it work, make it fast" rule.`,
      },
      {
        heading: 'Linear Search',
        body: `Linear search is the simplest searching algorithm: check every element one by one until you find the target.

\`\`\`python
def linear_search(nums, target):
    for i, n in enumerate(nums):
        if n == target:
            return i    # found at index i
    return -1           # not found
\`\`\`

It always works. But if the list has a million elements and the target is at the end, you check a million times. Next up: Big O Notation will give you a precise language to describe exactly how slow (or fast) this is.`,
        codeByLang: [
          {
            javascript: `function linearSearch(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) return i;   // found
    }
    return -1;                              // not found
}`,
            java: `int linearSearch(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;    // found
    }
    return -1;                              // not found
}`,
            cpp: `int linearSearch(vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] == target) return i;    // found
    }
    return -1;                              // not found
}`,
          },
        ],
      },
    ],
  },
  {
    slug: 'big-o-notation',
    title: 'Big O Notation',
    track: 'foundations',
    trackOrder: 2,
    category: 'foundations',
    categoryLabel: 'Foundations',
    difficulty: 'beginner',
    summary: 'Learn to measure and compare algorithm speed and memory usage without running any code.',
    timeEstimate: 12,
    relatedProblems: ['two-sum'],
    content: [
      {
        heading: 'Why We Need It',
        body: `Two algorithms can both be correct but have wildly different speeds. Big O notation gives us a way to compare them precisely — without running them, without knowing the hardware.

The core idea: describe how the number of operations grows as the input size n grows. We drop constants and lower-order terms because we only care about the dominant factor at large n.

O(2n + 5) simplifies to O(n). Why? When n = 1,000,000, the +5 is irrelevant and the 2 is just a constant multiplier.`,
      },
      {
        heading: 'The Common Complexities',
        body: `Ordered from fastest to slowest:

O(1) — Constant. Doesn't matter how big the input is.
Example: array[0], hash map lookup.

O(log n) — Logarithmic. Halves the problem each step.
Example: binary search on a sorted array. For n = 1,000,000 this is only ~20 steps.

O(n) — Linear. One operation per element.
Example: linear search, summing a list.

O(n log n) — Log-linear. The best we can do for comparison-based sorting.
Example: merge sort, quick sort.

O(n²) — Quadratic. A loop inside a loop.
Example: bubble sort, checking all pairs.

O(2ⁿ) — Exponential. Doubles with each new element.
Example: naive recursive Fibonacci, brute-force subset enumeration.`,
      },
      {
        heading: 'Reading Code for Big O',
        body: `Rules of thumb:

A single loop → O(n).
A loop inside a loop → O(n²).
Cutting the problem in half each step → O(log n).
Doing O(n) work log n times → O(n log n).

\`\`\`python
# O(n) — one pass through the list
def sum_all(nums):
    total = 0
    for n in nums:      # runs n times
        total += n
    return total

# O(n²) — for every element, check every other element
def has_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):  # nested loop
            if nums[i] == nums[j]:
                return True
    return False
\`\`\`

The has_duplicate above does roughly n²/2 comparisons. We drop the 1/2 → O(n²).`,
        codeByLang: [
          {
            javascript: `// O(n) — one pass through the list
function sumAll(nums) {
    let total = 0;
    for (const n of nums) total += n;  // runs n times
    return total;
}

// O(n²) — for every element, check every other element
function hasDuplicate(nums) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {  // nested loop
            if (nums[i] === nums[j]) return true;
        }
    }
    return false;
}`,
            java: `// O(n) — one pass through the list
int sumAll(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;  // runs n times
    return total;
}

// O(n²) — for every element, check every other element
boolean hasDuplicate(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {  // nested loop
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}`,
            cpp: `// O(n) — one pass through the list
int sumAll(vector<int>& nums) {
    int total = 0;
    for (int n : nums) total += n;  // runs n times
    return total;
}

// O(n²) — for every element, check every other element
bool hasDuplicate(vector<int>& nums) {
    for (int i = 0; i < (int)nums.size(); i++) {
        for (int j = i+1; j < (int)nums.size(); j++) {  // nested loop
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}`,
          },
        ],
      },
      {
        heading: 'Space Complexity',
        body: `Big O also describes memory usage. Space complexity counts how much extra memory an algorithm uses (not counting the input itself).

O(1) space — uses a fixed amount of extra memory regardless of input size. A few variables.
O(n) space — allocates memory proportional to input size. Creating a copy of the array.
O(log n) space — a recursive function that halves the input: the call stack grows log n levels deep.

The has_duplicate O(n²) solution above uses O(1) extra space. If instead you put elements in a set and check membership, it runs in O(n) time but needs O(n) space for the set. This time-space tradeoff appears constantly.`,
      },
      {
        heading: 'Best, Average, Worst Case',
        body: `The same algorithm can have different complexities depending on the input:

Best case: the luckiest possible input. Linear search finds the target at index 0 → O(1).
Average case: a typical random input. Linear search checks half the list on average → O(n).
Worst case: the hardest possible input. Linear search's target is at the end → O(n).

When people say an algorithm is O(n), they usually mean worst case. This is the standard unless specified otherwise.`,
      },
    ],
  },
  {
    slug: 'arrays-and-strings',
    title: 'Arrays & Strings',
    track: 'foundations',
    trackOrder: 3,
    category: 'foundations',
    categoryLabel: 'Foundations',
    difficulty: 'beginner',
    summary: 'The most fundamental data structure — understand how arrays work and the patterns built on top of them.',
    timeEstimate: 10,
    relatedProblems: ['two-sum', 'valid-palindrome'],
    content: [
      {
        heading: 'What is an Array?',
        body: `An array stores elements in contiguous memory locations. Because of this layout, you can access any element in O(1) by index — the computer just calculates the memory address: base_address + index × element_size.

Key operations and their complexity:
• Access by index: O(1)
• Search (unsorted): O(n)
• Insert at end: O(1) amortised (dynamic arrays)
• Insert at position i: O(n) — must shift elements right
• Delete at position i: O(n) — must shift elements left

\`\`\`python
nums = [3, 1, 4, 1, 5, 9]
print(nums[2])      # O(1) — direct access → 4
nums.append(2)      # O(1) — add to end
nums.insert(0, 0)   # O(n) — shifts everything right
\`\`\``,
        codeByLang: [
          {
            javascript: `const nums = [3, 1, 4, 1, 5, 9];
console.log(nums[2]);       // O(1) — direct access → 4
nums.push(2);               // O(1) — add to end
nums.unshift(0);            // O(n) — shifts everything right`,
            java: `int[] nums = {3, 1, 4, 1, 5, 9};
System.out.println(nums[2]);  // O(1) — direct access → 4
// Java arrays are fixed size; use ArrayList for dynamic resizing
List<Integer> list = new ArrayList<>(Arrays.asList(3,1,4,1,5,9));
list.add(2);                  // O(1) amortised — add to end
list.add(0, 0);               // O(n) — shifts right`,
            cpp: `vector<int> nums = {3, 1, 4, 1, 5, 9};
cout << nums[2];              // O(1) — direct access → 4
nums.push_back(2);            // O(1) amortised — add to end
nums.insert(nums.begin(), 0); // O(n) — shifts right`,
          },
        ],
      },
      {
        heading: 'Strings',
        body: `A string is an array of characters. In most languages strings are immutable — you cannot modify them in place.

This matters for complexity: "concatenating" strings with + in a loop is O(n²) total because each + creates a new string and copies all previous characters.

\`\`\`python
# Bad: O(n²) — creates a new string on every +
result = ""
for ch in chars:
    result += ch

# Good: O(n) — join at the end
result = "".join(chars)
\`\`\`

Always build strings by collecting parts in a list and joining at the end.`,
        codeByLang: [
          {
            javascript: `// Bad: O(n²) in some engines — new string each concatenation
let result = "";
for (const ch of chars) result += ch;

// Good: O(n) — join at the end
const result2 = chars.join("");`,
            java: `// Bad: O(n²) — String is immutable, new object each time
String result = "";
for (char ch : chars) result += ch;

// Good: O(n) — StringBuilder is mutable
StringBuilder sb = new StringBuilder();
for (char ch : chars) sb.append(ch);
String result2 = sb.toString();`,
            cpp: `// Bad: O(n²) — std::string concatenation copies
string result = "";
for (char ch : chars) result += ch;  // actually O(n) amortised in C++

// Good: O(n) — reserve then push
string result2; result2.reserve(chars.size());
for (char ch : chars) result2.push_back(ch);`,
          },
        ],
      },
      {
        heading: 'Prefix Sums',
        body: `A prefix sum array lets you answer "what is the sum of elements from index i to j?" in O(1) after O(n) preprocessing.

\`\`\`python
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i, n in enumerate(nums):
        prefix[i + 1] = prefix[i] + n
    return prefix

def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]

# Example
nums   = [3, 1, 4, 1, 5]
prefix = [0, 3, 4, 8, 9, 14]
range_sum(prefix, 1, 3)  # 1 + 4 + 1 = 6
\`\`\`

The trick: prefix[right+1] − prefix[left] cancels out everything before index left.`,
        codeByLang: [
          {
            javascript: `function buildPrefix(nums) {
    const prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) prefix[i+1] = prefix[i] + nums[i];
    return prefix;
}
function rangeSum(prefix, left, right) {
    return prefix[right + 1] - prefix[left];
}`,
            java: `int[] buildPrefix(int[] nums) {
    int[] prefix = new int[nums.length + 1];
    for (int i = 0; i < nums.length; i++) prefix[i+1] = prefix[i] + nums[i];
    return prefix;
}
int rangeSum(int[] prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}`,
            cpp: `vector<int> buildPrefix(vector<int>& nums) {
    vector<int> prefix(nums.size() + 1, 0);
    for (int i = 0; i < (int)nums.size(); i++) prefix[i+1] = prefix[i] + nums[i];
    return prefix;
}
int rangeSum(vector<int>& prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}`,
          },
        ],
      },
      {
        heading: 'Common Patterns',
        body: `Two pointer on arrays: one at the start, one at the end, move them toward each other.

Frequency map: use a hash map to count how many times each element appears — turns O(n²) duplicate checks into O(n).

Sorting first: many array problems become trivial once sorted. Sorting costs O(n log n) but often enables O(n) solutions afterward, for a total of O(n log n).

These are the foundations of every array algorithm. The next concept — Linked Lists — shows what happens when you sacrifice O(1) random access for O(1) insert and delete anywhere.`,
      },
    ],
  },
  // ── Data Structures ──────────────────────────────────────────────────────
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    track: 'algorithms',
    trackOrder: 1,
    category: 'arrays',
    categoryLabel: 'Arrays',
    difficulty: 'beginner',
    summary: 'Use two indices that move through an array to solve problems in linear time.',
    timeEstimate: 12,
    relatedProblems: ['two-sum', 'valid-palindrome', 'container-with-most-water'],
    content: [
      {
        heading: 'Overview',
        body: `Two Pointers is a pattern where you maintain two index variables — typically called left and right — that traverse an array or string from different positions, often converging toward each other.

Instead of the naive O(n²) approach of checking every pair, two pointers reduces many problems to a single O(n) pass. The key insight is that you can eliminate large chunks of the search space with each step.`,
      },
      {
        heading: 'The Algorithm',
        body: `The canonical form operates on a sorted array. You start with left = 0 and right = n − 1, then move them based on a condition:

\`\`\`python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1   # need a larger value
        else:
            right -= 1  # need a smaller value
    return []
\`\`\`

The logic: if the sum is too small, move left forward (get a bigger left element); if too large, move right backward.`,
        codeByLang: [
          {
            javascript: `function twoSumSorted(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const s = nums[left] + nums[right];
        if (s === target) return [left, right];
        else if (s < target) left++;
        else right--;
    }
    return [];
}`,
            java: `int[] twoSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == target) return new int[]{left, right};
        else if (s < target) left++;
        else right--;
    }
    return new int[]{};
}`,
            cpp: `vector<int> twoSumSorted(vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == target) return {left, right};
        else if (s < target) left++;
        else right--;
    }
    return {};
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Time complexity: O(n) — each pointer moves at most n steps, and they never cross, so total iterations ≤ n.

Space complexity: O(1) — only two index variables, regardless of input size.

This is the main advantage over the brute-force O(n²) double-loop approach.`,
      },
      {
        heading: 'Common Patterns',
        body: `Two pointers appears in several flavours:

Same direction (fast & slow): both pointers start at the left and move right, but at different speeds. Used for cycle detection in linked lists, removing duplicates in-place.

\`\`\`python
def remove_duplicates(nums):
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
\`\`\`

Opposite ends: converging inward. Used for pair-sum, palindrome check, trapping rain water.

Partition: one pointer tracks the boundary of a region while the other scans. Used in Dutch National Flag, quicksort partition.`,
        codeByLang: [
          {
            javascript: `function removeDuplicates(nums) {
    let slow = 0;
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}`,
            java: `int removeDuplicates(int[] nums) {
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}`,
            cpp: `int removeDuplicates(vector<int>& nums) {
    int slow = 0;
    for (int fast = 1; fast < (int)nums.size(); fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}`,
          },
        ],
      },
      {
        heading: 'When to Use It',
        body: `Reach for two pointers when:
• The array is sorted (or can be sorted first)
• You're looking for a pair, triplet, or subarray satisfying some constraint
• The problem asks for in-place modification
• You see the phrase "without extra space"

If the array is unsorted and sorting first is too expensive, consider a hash map instead (trades O(1) space for O(n) space to get O(n) time without sorting).`,
      },
    ],
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    track: 'algorithms',
    trackOrder: 2,
    category: 'arrays',
    categoryLabel: 'Arrays',
    difficulty: 'intermediate',
    summary: 'Maintain a moving subarray to find optimal contiguous subarrays in O(n).',
    timeEstimate: 15,
    relatedProblems: ['best-time-to-buy-and-sell-stock', 'longest-substring-without-repeating-characters', 'minimum-window-substring'],
    content: [
      {
        heading: 'Overview',
        body: `A sliding window is a subarray (or substring) that moves across the input, expanding and contracting to maintain some invariant. It avoids recomputing from scratch each time you move — instead you add one element on the right and remove one on the left.

The result is O(n) time for problems that would otherwise require O(n²) nested loops.`,
      },
      {
        heading: 'Fixed vs Variable Window',
        body: `Fixed-size window: the window length k is given. Slide it one step at a time, adding the new element and subtracting the outgoing one.

\`\`\`python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        best = max(best, window_sum)
    return best
\`\`\`

Variable-size window: you expand the right pointer until a constraint is violated, then shrink from the left until it's satisfied again. This finds the longest/shortest window meeting some condition.

\`\`\`python
def longest_no_repeat(s):
    seen = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best
\`\`\``,
        codeByLang: [
          {
            javascript: `function maxSumSubarray(nums, k) {
    let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
    let best = windowSum;
    for (let i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        best = Math.max(best, windowSum);
    }
    return best;
}`,
            java: `int maxSumSubarray(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int best = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        best = Math.max(best, windowSum);
    }
    return best;
}`,
            cpp: `int maxSumSubarray(vector<int>& nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int best = windowSum;
    for (int i = k; i < (int)nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        best = max(best, windowSum);
    }
    return best;
}`,
          },
          {
            javascript: `function longestNoRepeat(s) {
    const seen = new Map();
    let left = 0, best = 0;
    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        if (seen.has(ch) && seen.get(ch) >= left) left = seen.get(ch) + 1;
        seen.set(ch, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
            java: `int longestNoRepeat(String s) {
    Map<Character, Integer> seen = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        if (seen.containsKey(ch) && seen.get(ch) >= left) left = seen.get(ch) + 1;
        seen.put(ch, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
            cpp: `int longestNoRepeat(string s) {
    unordered_map<char, int> seen;
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        char ch = s[right];
        if (seen.count(ch) && seen[ch] >= left) left = seen[ch] + 1;
        seen[ch] = right;
        best = max(best, right - left + 1);
    }
    return best;
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Time: O(n) — despite the nested-looking loop, each element enters the window once and leaves once, so total work is 2n steps.

Space: O(1) for numeric problems; O(k) for problems that track characters or elements inside the window (e.g., a frequency map).`,
      },
      {
        heading: 'Common Patterns',
        body: `At most K distinct characters: expand right freely, shrink left when you exceed K distinct elements.

Minimum window containing all targets: use a "have" vs "need" counter to know when the window is valid, then try to shrink it.

\`\`\`python
def min_window(s, t):
    need = Counter(t)
    have, total = {}, 0
    left, res, res_len = 0, (-1, -1), float('inf')
    for right, ch in enumerate(s):
        have[ch] = have.get(ch, 0) + 1
        if ch in need and have[ch] == need[ch]:
            total += 1
        while total == len(need):
            if (right - left + 1) < res_len:
                res, res_len = (left, right), right - left + 1
            have[s[left]] -= 1
            if s[left] in need and have[s[left]] < need[s[left]]:
                total -= 1
            left += 1
    l, r = res
    return s[l:r+1] if res_len != float('inf') else ''
\`\`\``,
        codeByLang: [
          {
            javascript: `function minWindow(s, t) {
    const need = new Map();
    for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
    const have = new Map();
    let total = 0, left = 0, resLeft = -1, resLen = Infinity;
    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        have.set(ch, (have.get(ch) || 0) + 1);
        if (need.has(ch) && have.get(ch) === need.get(ch)) total++;
        while (total === need.size) {
            if (right - left + 1 < resLen) { resLeft = left; resLen = right - left + 1; }
            const lch = s[left];
            have.set(lch, have.get(lch) - 1);
            if (need.has(lch) && have.get(lch) < need.get(lch)) total--;
            left++;
        }
    }
    return resLeft === -1 ? '' : s.slice(resLeft, resLeft + resLen);
}`,
            java: `String minWindow(String s, String t) {
    Map<Character,Integer> need = new HashMap<>(), have = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
    int total = 0, left = 0, resLeft = -1, resLen = Integer.MAX_VALUE;
    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        have.merge(ch, 1, Integer::sum);
        if (need.containsKey(ch) && have.get(ch).equals(need.get(ch))) total++;
        while (total == need.size()) {
            if (right - left + 1 < resLen) { resLeft = left; resLen = right - left + 1; }
            char lch = s.charAt(left);
            have.merge(lch, -1, Integer::sum);
            if (need.containsKey(lch) && have.get(lch) < need.get(lch)) total--;
            left++;
        }
    }
    return resLeft == -1 ? "" : s.substring(resLeft, resLeft + resLen);
}`,
            cpp: `string minWindow(string s, string t) {
    unordered_map<char,int> need, have;
    for (char c : t) need[c]++;
    int total = 0, left = 0, resLeft = -1, resLen = INT_MAX;
    for (int right = 0; right < (int)s.size(); right++) {
        char ch = s[right];
        have[ch]++;
        if (need.count(ch) && have[ch] == need[ch]) total++;
        while (total == (int)need.size()) {
            if (right - left + 1 < resLen) { resLeft = left; resLen = right - left + 1; }
            char lch = s[left];
            if (need.count(lch) && --have[lch] < need[lch]) total--;
            left++;
        }
    }
    return resLeft == -1 ? "" : s.substr(resLeft, resLen);
}`,
          },
        ],
      },
      {
        heading: 'When to Use It',
        body: `Use sliding window when:
• The problem asks about contiguous subarrays or substrings
• You need to find the longest/shortest subarray satisfying a condition
• The "validity" of a window can be maintained incrementally (adding/removing one element at a time)

If validity requires global knowledge of the array (not just local window state), sliding window won't apply.`,
      },
    ],
  },
  {
    slug: 'hash-maps',
    title: 'Hash Maps',
    track: 'data-structures',
    trackOrder: 3,
    category: 'hash-maps',
    categoryLabel: 'Hash Maps',
    difficulty: 'beginner',
    summary: 'Trade O(n) space for O(1) average-case lookups — the most versatile tool in your kit.',
    timeEstimate: 10,
    relatedProblems: ['two-sum', 'group-anagrams', 'top-k-frequent-elements'],
    content: [
      {
        heading: 'Overview',
        body: `A hash map (dictionary in Python, HashMap in Java, object/Map in JS) maps keys to values using a hash function. The key property: average O(1) insert, lookup, and delete.

In algorithm problems, hash maps are the go-to tool whenever you need to "remember something you've seen before" without scanning the whole array again.`,
      },
      {
        heading: 'How Hashing Works',
        body: `A hash function maps a key to a bucket index. Python's dict, for example, calls hash(key) % table_size to find the bucket, then handles collisions via open addressing.

You don't implement this — the language does. What matters for interviews is understanding the complexity guarantees and when they break down (adversarial inputs can cause O(n) worst case, but this is irrelevant in practice).`,
      },
      {
        heading: 'Complexity Analysis',
        body: `Average case: O(1) insert, lookup, delete.
Worst case: O(n) — all keys hash to the same bucket.
Space: O(n) for n stored entries.

For most interview purposes, assume O(1) and O(n) space.`,
      },
      {
        heading: 'Common Patterns',
        body: `Frequency count: count occurrences of each element.

\`\`\`python
from collections import Counter
freq = Counter(nums)  # {element: count}
\`\`\`

Two Sum: for each number, check if its complement already exists.

\`\`\`python
def two_sum(nums, target):
    seen = {}  # value → index
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
\`\`\`

Grouping: use a canonical form as the key (e.g., sorted string for anagrams).

\`\`\`python
def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = tuple(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())
\`\`\``,
        codeByLang: [
          {
            javascript: `const freq = new Map();
for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);`,
            java: `Map<Integer,Integer> freq = new HashMap<>();
for (int n : nums) freq.merge(n, 1, Integer::sum);`,
            cpp: `unordered_map<int,int> freq;
for (int n : nums) freq[n]++;`,
          },
          {
            javascript: `function twoSum(nums, target) {
    const seen = new Map(); // value → index
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement), i];
        seen.set(nums[i], i);
    }
}`,
            java: `int[] twoSum(int[] nums, int target) {
    Map<Integer,Integer> seen = new HashMap<>(); // value → index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
            cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen; // value → index
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
          },
          {
            javascript: `function groupAnagrams(strs) {
    const groups = new Map();
    for (const s of strs) {
        const key = s.split('').sort().join('');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
    }
    return [...groups.values()];
}`,
            java: `List<List<String>> groupAnagrams(String[] strs) {
    Map<String,List<String>> groups = new HashMap<>();
    for (String s : strs) {
        char[] arr = s.toCharArray(); Arrays.sort(arr);
        groups.computeIfAbsent(new String(arr), k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}`,
            cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string,vector<string>> groups;
    for (auto& s : strs) {
        string key = s; sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    vector<vector<string>> result;
    for (auto& [k, v] : groups) result.push_back(v);
    return result;
}`,
          },
        ],
      },
      {
        heading: 'When to Use It',
        body: `Hash maps shine when:
• You need to look up "have I seen X before?"
• You need to count frequencies
• You want to avoid a nested loop (O(n²) → O(n) by pre-building a map)
• You need to group elements by some property

The tradeoff: you spend O(n) extra memory to save O(n) time. When memory is constrained, consider sorting + two pointers instead.`,
      },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    track: 'algorithms',
    trackOrder: 3,
    category: 'arrays',
    categoryLabel: 'Arrays',
    difficulty: 'beginner',
    summary: 'Halve the search space each step to find answers in O(log n) on sorted data.',
    timeEstimate: 12,
    relatedProblems: ['search-in-rotated-sorted-array', 'find-minimum-in-rotated-sorted-array', 'koko-eating-bananas'],
    content: [
      {
        heading: 'Overview',
        body: `Binary search repeatedly halves the search space. Given a sorted array of n elements, it finds a target in O(log n) instead of the O(n) linear scan.

The idea: look at the middle element. If it equals the target, done. If the target is smaller, the answer must be in the left half; if larger, in the right half. Recurse on the relevant half.`,
      },
      {
        heading: 'The Algorithm',
        body: `The iterative form is preferred (avoids stack overhead):

\`\`\`python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2  # avoids integer overflow
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

Critical detail: mid = left + (right - left) // 2 instead of (left + right) // 2 avoids integer overflow in languages with fixed-width integers.`,
        codeByLang: [
          {
            javascript: `function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2); // avoids overflow
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
            java: `int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // avoids overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
            cpp: `int binarySearch(vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // avoids overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Time: O(log n) — each iteration halves the remaining search space. After log₂(n) steps, the space is size 1.

Space: O(1) iterative; O(log n) recursive (call stack).

For n = 1,000,000 elements, binary search needs at most 20 comparisons. A linear scan needs up to 1,000,000.`,
      },
      {
        heading: 'Beyond Simple Search',
        body: `Binary search applies whenever you can define a monotone predicate — a condition that is false for a prefix of values and true for the rest (or vice versa).

Find first true: search for the leftmost position where a condition holds.

\`\`\`python
def first_bad_version(n, is_bad):
    left, right = 1, n
    while left < right:
        mid = left + (right - left) // 2
        if is_bad(mid):
            right = mid       # could be the answer
        else:
            left = mid + 1    # definitely not the answer
    return left
\`\`\`

Binary search on the answer: when you can check "is X feasible?" in O(n), binary search over X to find the minimum/maximum feasible value. (Koko Eating Bananas, Capacity To Ship Packages.)`,
        codeByLang: [
          {
            javascript: `function firstBadVersion(n, isBad) {
    let left = 1, right = n;
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        if (isBad(mid)) right = mid;     // could be the answer
        else left = mid + 1;             // definitely not the answer
    }
    return left;
}`,
            java: `int firstBadVersion(int n) {
    int left = 1, right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (isBadVersion(mid)) right = mid;   // could be the answer
        else left = mid + 1;                  // definitely not the answer
    }
    return left;
}`,
            cpp: `int firstBadVersion(int n) {
    int left = 1, right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (isBadVersion(mid)) right = mid;   // could be the answer
        else left = mid + 1;                  // definitely not the answer
    }
    return left;
}`,
          },
        ],
      },
      {
        heading: 'Common Pitfalls',
        body: `Off-by-one errors are the main hazard. Use this checklist:
• Loop condition: left <= right for exact search; left < right for "find boundary"
• How you move pointers: left = mid + 1 (not mid), right = mid - 1 (not mid) for exact; right = mid (not mid - 1) for "find first true"
• Return value: -1 for not found; left for insertion point

When in doubt, trace through a 2-element or 3-element example by hand before coding.`,
      },
    ],
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    track: 'data-structures',
    trackOrder: 1,
    category: 'arrays',
    categoryLabel: 'Arrays',
    difficulty: 'beginner',
    summary: 'Node-based linear structure — master pointer manipulation and the fast/slow trick.',
    timeEstimate: 14,
    relatedProblems: ['reverse-linked-list', 'linked-list-cycle', 'merge-two-sorted-lists'],
    content: [
      {
        heading: 'Overview',
        body: `A linked list is a sequence of nodes where each node holds a value and a pointer to the next node. Unlike arrays, elements are not stored contiguously — traversal requires following pointers.

Key tradeoff: O(1) insert/delete at a known node; O(n) access to the k-th element (no random access).`,
      },
      {
        heading: 'Core Operations',
        body: `Node definition and basic traversal:

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def traverse(head):
    curr = head
    while curr:
        print(curr.val)
        curr = curr.next
\`\`\`

Reversal — one of the most common operations:

\`\`\`python
def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev  # new head
\`\`\``,
        codeByLang: [
          {
            javascript: `class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

function traverse(head) {
    let curr = head;
    while (curr) { console.log(curr.val); curr = curr.next; }
}`,
            java: `class ListNode {
    int val; ListNode next;
    ListNode(int val) { this.val = val; }
}

void traverse(ListNode head) {
    ListNode curr = head;
    while (curr != null) { System.out.println(curr.val); curr = curr.next; }
}`,
            cpp: `struct ListNode {
    int val; ListNode* next;
    ListNode(int val = 0, ListNode* next = nullptr) : val(val), next(next) {}
};

void traverse(ListNode* head) {
    ListNode* curr = head;
    while (curr) { cout << curr->val << "\\n"; curr = curr->next; }
}`,
          },
          {
            javascript: `function reverse(head) {
    let prev = null, curr = head;
    while (curr) {
        const nxt = curr.next;
        curr.next = prev; prev = curr; curr = nxt;
    }
    return prev; // new head
}`,
            java: `ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nxt = curr.next;
        curr.next = prev; prev = curr; curr = nxt;
    }
    return prev; // new head
}`,
            cpp: `ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev; prev = curr; curr = nxt;
    }
    return prev; // new head
}`,
          },
        ],
      },
      {
        heading: 'Fast & Slow Pointers',
        body: `The fast/slow (Floyd's) pattern solves cycle detection and middle-finding:

\`\`\`python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # middle node
\`\`\`

Why it works: fast moves twice as fast as slow. If there's a cycle, fast laps slow and they meet. In a list of n nodes, fast reaches the end in n/2 steps, at which point slow is at the middle.`,
        codeByLang: [
          {
            javascript: `function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next; fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}

function findMiddle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
    return slow; // middle node
}`,
            java: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}

ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
    return slow; // middle node
}`,
            cpp: `bool hasCycle(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

ListNode* findMiddle(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    return slow; // middle node
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Access k-th element: O(n)
Insert/delete at known node: O(1)
Search: O(n)
Space: O(1) for in-place operations; O(n) if you convert to array first

The dummy head trick eliminates edge cases for operations at the head of the list:

\`\`\`python
def delete_nth_from_end(head, n):
    dummy = ListNode(0, head)
    left = dummy
    right = head
    for _ in range(n):
        right = right.next
    while right:
        left = left.next
        right = right.next
    left.next = left.next.next
    return dummy.next
\`\`\``,
        codeByLang: [
          {
            javascript: `function deleteNthFromEnd(head, n) {
    const dummy = new ListNode(0, head);
    let left = dummy, right = head;
    for (let i = 0; i < n; i++) right = right.next;
    while (right) { left = left.next; right = right.next; }
    left.next = left.next.next;
    return dummy.next;
}`,
            java: `ListNode deleteNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0); dummy.next = head;
    ListNode left = dummy, right = head;
    for (int i = 0; i < n; i++) right = right.next;
    while (right != null) { left = left.next; right = right.next; }
    left.next = left.next.next;
    return dummy.next;
}`,
            cpp: `ListNode* deleteNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head);
    ListNode* left = &dummy, *right = head;
    for (int i = 0; i < n; i++) right = right->next;
    while (right) { left = left->next; right = right->next; }
    left->next = left->next->next;
    return dummy.next;
}`,
          },
        ],
      },
      {
        heading: 'Interview Tips',
        body: `Draw the list before coding. Pointer bugs are hard to spot in your head but obvious on paper.

Always handle: empty list (head is None), single-node list, the last node having None as next.

Prefer the dummy head pattern whenever you might need to modify the head node — it unifies edge cases.

When asked to find the k-th from end without knowing length: use two pointers offset by k steps. This is the "right distance" trick seen in fast/slow problems.`,
      },
    ],
  },
  {
    slug: 'stacks-queues',
    title: 'Stacks & Queues',
    track: 'data-structures',
    trackOrder: 2,
    category: 'arrays',
    categoryLabel: 'Arrays',
    difficulty: 'beginner',
    summary: 'LIFO and FIFO structures that underpin DFS, BFS, and expression evaluation.',
    timeEstimate: 10,
    relatedProblems: ['valid-parentheses', 'daily-temperatures', 'implement-queue-using-stacks'],
    content: [
      {
        heading: 'Overview',
        body: `A stack is Last-In-First-Out (LIFO): the last element pushed is the first popped. Think of a stack of plates.

A queue is First-In-First-Out (FIFO): elements are processed in the order they arrived. Think of a line at a checkout.

Both operations (push/pop for stack; enqueue/dequeue for queue) are O(1).`,
      },
      {
        heading: 'Stack in Practice',
        body: `Python's list works as a stack (append = push, pop = pop). For Java use ArrayDeque; for JS use an array with push/pop.

Classic use: matching brackets.

\`\`\`python
def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif not stack or stack[-1] != pairs[ch]:
            return False
        else:
            stack.pop()
    return not stack
\`\`\`

Monotonic stack: maintain a stack that stays in sorted order. Used for "next greater element" problems.

\`\`\`python
def daily_temperatures(temps):
    ans = [0] * len(temps)
    stack = []  # indices of unresolved days
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)
    return ans
\`\`\``,
        codeByLang: [
          {
            javascript: `function isValid(s) {
    const stack = [];
    const pairs = {')': '(', '}': '{', ']': '['};
    for (const ch of s) {
        if ('([{'.includes(ch)) stack.push(ch);
        else if (!stack.length || stack[stack.length - 1] !== pairs[ch]) return false;
        else stack.pop();
    }
    return stack.length === 0;
}`,
            java: `boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character,Character> pairs = Map.of(')', '(', '}', '{', ']', '[');
    for (char ch : s.toCharArray()) {
        if ("([{".indexOf(ch) >= 0) stack.push(ch);
        else if (stack.isEmpty() || stack.peek() != pairs.get(ch)) return false;
        else stack.pop();
    }
    return stack.isEmpty();
}`,
            cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char,char> pairs = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char ch : s) {
        if (ch == '(' || ch == '{' || ch == '[') st.push(ch);
        else if (st.empty() || st.top() != pairs[ch]) return false;
        else st.pop();
    }
    return st.empty();
}`,
          },
          {
            javascript: `function dailyTemperatures(temps) {
    const ans = new Array(temps.length).fill(0);
    const stack = []; // indices of unresolved days
    for (let i = 0; i < temps.length; i++) {
        while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
            const j = stack.pop(); ans[j] = i - j;
        }
        stack.push(i);
    }
    return ans;
}`,
            java: `int[] dailyTemperatures(int[] temps) {
    int[] ans = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>(); // indices of unresolved days
    for (int i = 0; i < temps.length; i++) {
        while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
            int j = stack.pop(); ans[j] = i - j;
        }
        stack.push(i);
    }
    return ans;
}`,
            cpp: `vector<int> dailyTemperatures(vector<int>& temps) {
    vector<int> ans(temps.size(), 0);
    stack<int> st; // indices of unresolved days
    for (int i = 0; i < (int)temps.size(); i++) {
        while (!st.empty() && temps[st.top()] < temps[i]) {
            int j = st.top(); st.pop(); ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
          },
        ],
      },
      {
        heading: 'Queue in Practice',
        body: `Use collections.deque for O(1) appends and poplefts in Python.

\`\`\`python
from collections import deque

q = deque()
q.append(1)      # enqueue
q.popleft()      # dequeue  O(1)
\`\`\`

Queues power BFS (Breadth-First Search) — see the Trees + BFS/DFS concept for the full pattern.`,
        codeByLang: [
          {
            javascript: `// JS arrays support push/pop but shift() is O(n) — use a real deque for large queues
const q = [];
q.push(1);    // enqueue
q.shift();    // dequeue  (O(n) for plain array)`,
            java: `Deque<Integer> q = new ArrayDeque<>();
q.offer(1);   // enqueue
q.poll();     // dequeue  O(1)`,
            cpp: `#include <deque>
deque<int> q;
q.push_back(1);  // enqueue
q.pop_front();   // dequeue  O(1)`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Stack and queue operations (push, pop, peek, enqueue, dequeue) are all O(1) with the right implementation.

Space: O(n) in the worst case (all elements in the structure).

Monotonic stack: amortised O(n) total — each element is pushed and popped at most once, so n iterations × O(1) amortised = O(n).`,
      },
      {
        heading: 'When to Use Each',
        body: `Stack: any problem with matching/nesting (brackets, function calls), undo/redo, DFS iteration, "next greater/smaller element".

Queue: BFS on graphs/trees, processing items in arrival order, sliding window minimum/maximum (deque).

Two stacks make a queue (useful interview question): push to stack1; when popping, if stack2 is empty transfer all of stack1 to stack2 and pop from stack2. This gives amortised O(1) dequeue.`,
      },
    ],
  },
  {
    slug: 'trees-bfs-dfs',
    title: 'Trees + BFS / DFS',
    track: 'advanced',
    trackOrder: 1,
    category: 'trees',
    categoryLabel: 'Trees',
    difficulty: 'intermediate',
    summary: 'Traverse hierarchical data with depth-first recursion or breadth-first queue.',
    timeEstimate: 20,
    relatedProblems: ['maximum-depth-of-binary-tree', 'level-order-traversal', 'lowest-common-ancestor'],
    content: [
      {
        heading: 'Tree Fundamentals',
        body: `A binary tree has nodes where each node has at most two children (left, right). Common vocabulary:

• Root — the top node (no parent)
• Leaf — a node with no children
• Height — longest path from root to a leaf
• Depth — distance from a node to the root

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
\`\`\``,
        codeByLang: [
          {
            javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val; this.left = left; this.right = right;
    }
}`,
            java: `class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}`,
            cpp: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int val=0, TreeNode* l=nullptr, TreeNode* r=nullptr)
        : val(val), left(l), right(r) {}
};`,
          },
        ],
      },
      {
        heading: 'Depth-First Search (DFS)',
        body: `DFS explores as deep as possible before backtracking. Three orders:

\`\`\`python
def inorder(root):    # left → root → right  (sorted order for BST)
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def preorder(root):   # root → left → right
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def postorder(root):  # left → right → root  (process children before parent)
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]
\`\`\`

Most tree problems use DFS recursion. The pattern: handle the base case (None), recurse on left and right, combine results.

\`\`\`python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
\`\`\``,
        codeByLang: [
          {
            javascript: `function inorder(root) {   // left → root → right  (sorted for BST)
    if (!root) return [];
    return [...inorder(root.left), root.val, ...inorder(root.right)];
}
function preorder(root) {  // root → left → right
    if (!root) return [];
    return [root.val, ...preorder(root.left), ...preorder(root.right)];
}
function postorder(root) { // left → right → root
    if (!root) return [];
    return [...postorder(root.left), ...postorder(root.right), root.val];
}`,
            java: `List<Integer> inorder(TreeNode root) {   // left → root → right (sorted for BST)
    if (root == null) return new ArrayList<>();
    List<Integer> res = inorder(root.left);
    res.add(root.val); res.addAll(inorder(root.right)); return res;
}
List<Integer> preorder(TreeNode root) {  // root → left → right
    if (root == null) return new ArrayList<>();
    List<Integer> res = new ArrayList<>(); res.add(root.val);
    res.addAll(preorder(root.left)); res.addAll(preorder(root.right)); return res;
}`,
            cpp: `vector<int> inorder(TreeNode* root) {   // left → root → right (sorted for BST)
    if (!root) return {};
    auto left = inorder(root->left);
    left.push_back(root->val);
    auto right = inorder(root->right);
    left.insert(left.end(), right.begin(), right.end());
    return left;
}`,
          },
          {
            javascript: `function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
            java: `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
            cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
          },
        ],
      },
      {
        heading: 'Breadth-First Search (BFS)',
        body: `BFS processes nodes level by level using a queue. Use it when you need level information or shortest path in an unweighted graph.

\`\`\`python
from collections import deque

def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):   # process entire level
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
\`\`\``,
        codeByLang: [
          {
            javascript: `function levelOrder(root) {
    if (!root) return [];
    const result = [], queue = [root];
    while (queue.length) {
        const level = [], size = queue.length;
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
}`,
            java: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>(); queue.offer(root);
    while (!queue.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll(); level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}`,
            cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> result;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        vector<int> level; int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `DFS and BFS both visit every node exactly once: O(n) time, where n is the number of nodes.

Space:
• DFS: O(h) call stack, where h is the height. Best case O(log n) for balanced tree; worst case O(n) for a skewed tree (essentially a linked list).
• BFS: O(w) queue, where w is the maximum width. Worst case O(n/2) = O(n) for the last level of a complete binary tree.

For a balanced tree, DFS uses less memory. For a very deep tree, BFS is safer.`,
      },
      {
        heading: 'Binary Search Tree (BST)',
        body: `A BST maintains the invariant: all values in the left subtree < node.val < all values in the right subtree.

This enables O(log n) search, insert, delete on a balanced BST.

\`\`\`python
def search(root, target):
    if not root or root.val == target:
        return root
    if target < root.val:
        return search(root.left, target)
    return search(root.right, target)
\`\`\`

Inorder traversal of a BST yields sorted output — a useful property to exploit.`,
        codeByLang: [
          {
            javascript: `function search(root, target) {
    if (!root || root.val === target) return root;
    if (target < root.val) return search(root.left, target);
    return search(root.right, target);
}`,
            java: `TreeNode search(TreeNode root, int target) {
    if (root == null || root.val == target) return root;
    if (target < root.val) return search(root.left, target);
    return search(root.right, target);
}`,
            cpp: `TreeNode* search(TreeNode* root, int target) {
    if (!root || root->val == target) return root;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}`,
          },
        ],
      },
    ],
  },
  {
    slug: 'recursion',
    title: 'Recursion & Backtracking',
    track: 'advanced',
    trackOrder: 2,
    category: 'recursion',
    categoryLabel: 'Recursion',
    difficulty: 'intermediate',
    summary: 'Solve problems by breaking them into identical subproblems; explore all paths with backtracking.',
    timeEstimate: 15,
    relatedProblems: ['subsets', 'permutations', 'combination-sum'],
    content: [
      {
        heading: 'Recursion Basics',
        body: `A function is recursive if it calls itself. Every recursive solution needs:
1. A base case that stops the recursion
2. A recursive case that reduces the problem toward the base case

\`\`\`python
def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)  # recursive case, n decreases each call
\`\`\`

Mental model: trust that your function correctly solves smaller inputs, then use it to solve the current input. You don't need to trace the full call stack — just verify the base case and the inductive step.`,
        codeByLang: [
          {
            javascript: `function factorial(n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}`,
            java: `int factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}`,
            cpp: `int factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}`,
          },
        ],
      },
      {
        heading: 'The Backtracking Template',
        body: `Backtracking = DFS over a decision tree + undoing choices when a path doesn't work.

\`\`\`python
def backtrack(candidates, start, current, result, target):
    if target == 0:          # valid complete solution
        result.append(current[:])
        return
    for i in range(start, len(candidates)):
        if candidates[i] > target:
            break             # pruning: no point continuing
        current.append(candidates[i])
        backtrack(candidates, i, current, result, target - candidates[i])
        current.pop()        # undo the choice (backtrack)

def combination_sum(candidates, target):
    candidates.sort()
    result = []
    backtrack(candidates, 0, [], result, target)
    return result
\`\`\`

The key line is current.pop() — it undoes the last choice so the next iteration of the loop can try a different option.`,
        codeByLang: [
          {
            javascript: `function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    function backtrack(start, current, rem) {
        if (rem === 0) { result.push([...current]); return; }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > rem) break; // pruning
            current.push(candidates[i]);
            backtrack(i, current, rem - candidates[i]);
            current.pop(); // undo the choice (backtrack)
        }
    }
    backtrack(0, [], target);
    return result;
}`,
            java: `List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, 0, new ArrayList<>(), result, target);
    return result;
}
void backtrack(int[] c, int start, List<Integer> cur,
               List<List<Integer>> res, int rem) {
    if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
    for (int i = start; i < c.length; i++) {
        if (c[i] > rem) break; // pruning
        cur.add(c[i]);
        backtrack(c, i, cur, res, rem - c[i]);
        cur.remove(cur.size() - 1); // undo the choice (backtrack)
    }
}`,
            cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> result;
    vector<int> current;
    function<void(int,int)> bt = [&](int start, int rem) {
        if (rem == 0) { result.push_back(current); return; }
        for (int i = start; i < (int)candidates.size(); i++) {
            if (candidates[i] > rem) break; // pruning
            current.push_back(candidates[i]);
            bt(i, rem - candidates[i]);
            current.pop_back(); // undo the choice (backtrack)
        }
    };
    bt(0, target);
    return result;
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Recursion: O(n) space for the call stack (depth of recursion). Time depends on the number of recursive calls.

Backtracking: time is typically O(b^d) where b = branching factor (choices at each node) and d = depth of the decision tree. In the worst case, this is exponential.

Pruning is critical — sorting + early break can eliminate large subtrees and make exponential algorithms practical for typical input sizes.`,
      },
      {
        heading: 'Subsets, Permutations, Combinations',
        body: `These three patterns cover most backtracking problems:

Subsets (no duplicates): at each step, decide to include or exclude the current element.

\`\`\`python
def subsets(nums):
    result = []
    def bt(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            bt(i + 1, current)
            current.pop()
    bt(0, [])
    return result
\`\`\`

Permutations: choose one unused element at each step.

\`\`\`python
def permutations(nums):
    result = []
    def bt(current, used):
        if len(current) == len(nums):
            result.append(current[:])
            return
        for i, n in enumerate(nums):
            if not used[i]:
                used[i] = True
                current.append(n)
                bt(current, used)
                current.pop()
                used[i] = False
    bt([], [False]*len(nums))
    return result
\`\`\``,
        codeByLang: [
          {
            javascript: `function subsets(nums) {
    const result = [];
    function bt(start, current) {
        result.push([...current]);
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]); bt(i + 1, current); current.pop();
        }
    }
    bt(0, []); return result;
}`,
            java: `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    bt(nums, 0, new ArrayList<>(), result); return result;
}
void bt(int[] nums, int start, List<Integer> cur, List<List<Integer>> res) {
    res.add(new ArrayList<>(cur));
    for (int i = start; i < nums.length; i++) {
        cur.add(nums[i]); bt(nums, i+1, cur, res); cur.remove(cur.size()-1);
    }
}`,
            cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result; vector<int> current;
    function<void(int)> bt = [&](int start) {
        result.push_back(current);
        for (int i = start; i < (int)nums.size(); i++) {
            current.push_back(nums[i]); bt(i+1); current.pop_back();
        }
    };
    bt(0); return result;
}`,
          },
          {
            javascript: `function permutations(nums) {
    const result = [], used = new Array(nums.length).fill(false);
    function bt(current) {
        if (current.length === nums.length) { result.push([...current]); return; }
        for (let i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true; current.push(nums[i]);
                bt(current);
                current.pop(); used[i] = false;
            }
        }
    }
    bt([]); return result;
}`,
            java: `List<List<Integer>> permutations(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    bt(nums, new ArrayList<>(), used, result); return result;
}
void bt(int[] nums, List<Integer> cur, boolean[] used, List<List<Integer>> res) {
    if (cur.size() == nums.length) { res.add(new ArrayList<>(cur)); return; }
    for (int i = 0; i < nums.length; i++) if (!used[i]) {
        used[i] = true; cur.add(nums[i]); bt(nums, cur, used, res);
        cur.remove(cur.size()-1); used[i] = false;
    }
}`,
            cpp: `vector<vector<int>> permutations(vector<int>& nums) {
    vector<vector<int>> result; vector<int> cur; vector<bool> used(nums.size());
    function<void()> bt = [&]() {
        if (cur.size() == nums.size()) { result.push_back(cur); return; }
        for (int i = 0; i < (int)nums.size(); i++) if (!used[i]) {
            used[i] = true; cur.push_back(nums[i]); bt();
            cur.pop_back(); used[i] = false;
        }
    };
    bt(); return result;
}`,
          },
        ],
      },
      {
        heading: 'Tips',
        body: `Draw the decision tree before coding. Each level = one decision; each branch = one choice. Count leaves to estimate time complexity.

Avoid creating new lists at each recursive call — use append/pop on a shared list and copy only when saving a result.

Memoisation converts pure recursion into dynamic programming when subproblems overlap. If your recursion recomputes the same (state) more than once, that's the signal to add a cache.`,
      },
    ],
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    track: 'advanced',
    trackOrder: 3,
    category: 'graphs',
    categoryLabel: 'Graphs',
    difficulty: 'advanced',
    summary: 'Break problems into overlapping subproblems and cache results to avoid redundant work.',
    timeEstimate: 25,
    relatedProblems: ['climbing-stairs', 'coin-change', 'longest-common-subsequence'],
    content: [
      {
        heading: 'What is DP?',
        body: `Dynamic programming solves problems with two properties:
1. Optimal substructure — the optimal solution to the whole problem is built from optimal solutions to subproblems.
2. Overlapping subproblems — the same subproblems recur many times.

The classic example: Fibonacci. Naive recursion recalculates fib(2) dozens of times. DP stores it once.

\`\`\`python
# Top-down with memoisation (recursion + cache)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

# Bottom-up (tabulation)
def fib_tab(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\``,
        codeByLang: [
          {
            javascript: `// Top-down with memoisation
const memo = new Map();
function fib(n) {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n);
    const res = fib(n-1) + fib(n-2);
    memo.set(n, res); return res;
}

// Bottom-up (tabulation)
function fibTab(n) {
    if (n <= 1) return n;
    const dp = new Array(n + 1).fill(0); dp[1] = 1;
    for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
            java: `// Top-down with memoisation
Map<Integer,Integer> memo = new HashMap<>();
int fib(int n) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    int res = fib(n-1) + fib(n-2); memo.put(n, res); return res;
}

// Bottom-up (tabulation)
int fibTab(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n+1]; dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
            cpp: `// Top-down with memoisation
unordered_map<int,int> memo;
int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);
}

// Bottom-up (tabulation)
int fibTab(int n) {
    if (n <= 1) return n;
    vector<int> dp(n+1, 0); dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
          },
        ],
      },
      {
        heading: 'The DP Framework',
        body: `Every DP solution has four components:

1. State: what changes between subproblems? (Usually an index, or two indices for 2D DP.)
2. Base case: smallest inputs with known answers.
3. Transition: how to compute dp[i] from smaller states.
4. Answer: which state(s) give the final answer.

Example — Coin Change (minimum coins to make amount):

\`\`\`python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0          # base case: 0 coins needed for amount 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)  # transition
    return dp[amount] if dp[amount] != float('inf') else -1
\`\`\``,
        codeByLang: [
          {
            javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // base case
    for (let a = 1; a <= amount; a++)
        for (const c of coins)
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1); // transition
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,
            java: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0; // base case
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1); // transition
    return dp[amount] > amount ? -1 : dp[amount];
}`,
            cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0; // base case
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1); // transition
    return dp[amount] > amount ? -1 : dp[amount];
}`,
          },
        ],
      },
      {
        heading: 'Complexity Analysis',
        body: `Time: O(number of states × work per state). For 1D DP with n states and O(k) work per state: O(n × k). For 2D DP: O(n × m).

Space: O(number of states). Often reducible: if dp[i] only depends on dp[i-1] and dp[i-2], you can use two variables instead of the full array — O(n) → O(1) space.

\`\`\`python
def fib_opt(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\``,
        codeByLang: [
          {
            javascript: `function fibOpt(n) {
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) [a, b] = [b, a + b];
    return a;
}`,
            java: `int fibOpt(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) { int tmp = b; b = a + b; a = tmp; }
    return a;
}`,
            cpp: `int fibOpt(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) { int tmp = b; b = a + b; a = tmp; }
    return a;
}`,
          },
        ],
      },
      {
        heading: '1D vs 2D DP',
        body: `1D DP: single index tracks progress. Climbing stairs, coin change, house robber.

2D DP: two indices, typically when comparing two sequences. Longest Common Subsequence:

\`\`\`python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
\`\`\``,
        codeByLang: [
          {
            javascript: `function lcs(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = s1[i-1] === s2[j-1]
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
            java: `int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = s1.charAt(i-1) == s2.charAt(j-1)
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
            cpp: `int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = s1[i-1] == s2[j-1]
                ? dp[i-1][j-1] + 1
                : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
          },
        ],
      },
      {
        heading: 'How to Identify DP Problems',
        body: `Signals that DP applies:
• "How many ways…?" (counting)
• "What is the minimum/maximum…?" (optimisation)
• "Is it possible to…?" (feasibility, often yes/no)
• The problem involves making sequential decisions with a sequence or grid

Process:
1. Try to write a recursive solution first.
2. Identify what arguments change between recursive calls — that's your state.
3. Add memoisation (top-down) or convert to bottom-up iteration.
4. Optimise space by noting which states are actually needed.`,
      },
    ],
  },
  {
    slug: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    track: 'algorithms',
    trackOrder: 4,
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'beginner',
    summary: 'Understand the algorithms behind sort() — and when to use each one.',
    timeEstimate: 12,
    relatedProblems: ['sort-colors', 'merge-intervals', 'kth-largest-element-in-array'],
    content: [
      {
        heading: 'Why Sort?',
        body: `Sorting is a prerequisite for many algorithms: binary search requires sorted input, two pointers often need sorted arrays, and interval merging is trivial once sorted by start time.

Built-in sorts (Python's sorted(), Java's Arrays.sort()) use Timsort — a hybrid of merge sort and insertion sort — with O(n log n) time and O(n) space. Use them in interviews unless the problem asks you to implement sorting.`,
      },
      {
        heading: 'Merge Sort',
        body: `Merge sort: divide the array in half, sort each half recursively, merge the sorted halves. Stable, O(n log n) always.

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]
\`\`\``,
        codeByLang: [
          {
            javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(left, right) {
    const result = []; let i = 0, j = 0;
    while (i < left.length && j < right.length)
        result.push(left[i] <= right[j] ? left[i++] : right[j++]);
    return result.concat(left.slice(i), right.slice(j));
}`,
            java: `int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    return merge(mergeSort(Arrays.copyOfRange(arr, 0, mid)),
                 mergeSort(Arrays.copyOfRange(arr, mid, arr.length)));
}
int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length]; int i=0,j=0,k=0;
    while (i<left.length && j<right.length)
        result[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i<left.length) result[k++] = left[i++];
    while (j<right.length) result[k++] = right[j++];
    return result;
}`,
            cpp: `vector<int> mergeSort(vector<int> arr) {
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;
    auto left = mergeSort({arr.begin(), arr.begin()+mid});
    auto right = mergeSort({arr.begin()+mid, arr.end()});
    vector<int> result; int i=0,j=0;
    while (i<(int)left.size() && j<(int)right.size())
        result.push_back(left[i]<=right[j] ? left[i++] : right[j++]);
    while (i<(int)left.size()) result.push_back(left[i++]);
    while (j<(int)right.size()) result.push_back(right[j++]);
    return result;
}`,
          },
        ],
      },
      {
        heading: 'Quick Sort',
        body: `Quick sort: pick a pivot, partition elements into smaller/equal/larger, recurse. Average O(n log n), worst case O(n²) (bad pivot choices). In-place, not stable.

\`\`\`python
def quicksort(arr, low, high):
    if low < high:
        p = partition(arr, low, high)
        quicksort(arr, low, p - 1)
        quicksort(arr, p + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
\`\`\`

Randomising the pivot eliminates worst-case behaviour on already-sorted input.`,
        codeByLang: [
          {
            javascript: `function quicksort(arr, low, high) {
    if (low < high) {
        const p = partition(arr, low, high);
        quicksort(arr, low, p - 1); quicksort(arr, p + 1, high);
    }
}
function partition(arr, low, high) {
    const pivot = arr[high]; let i = low - 1;
    for (let j = low; j < high; j++)
        if (arr[j] <= pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
    [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
    return i + 1;
}`,
            java: `void quicksort(int[] arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quicksort(arr, low, p-1); quicksort(arr, p+1, high);
    }
}
int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) { int t=arr[++i]; arr[i]=arr[j]; arr[j]=t; }
    int t=arr[i+1]; arr[i+1]=arr[high]; arr[high]=t;
    return i + 1;
}`,
            cpp: `void quicksort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quicksort(arr, low, p-1); quicksort(arr, p+1, high);
    }
}
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i+1], arr[high]); return i + 1;
}`,
          },
        ],
      },
      {
        heading: 'Complexity Comparison',
        body: `| Algorithm      | Best    | Average  | Worst    | Space  | Stable |
|----------------|---------|----------|----------|--------|--------|
| Bubble Sort    | O(n)    | O(n²)    | O(n²)    | O(1)   | Yes    |
| Insertion Sort | O(n)    | O(n²)    | O(n²)    | O(1)   | Yes    |
| Merge Sort     | O(n lg n)| O(n lg n)| O(n lg n)| O(n)   | Yes    |
| Quick Sort     | O(n lg n)| O(n lg n)| O(n²)    | O(lg n)| No     |
| Heap Sort      | O(n lg n)| O(n lg n)| O(n lg n)| O(1)   | No     |

For interview coding, just use the built-in sort unless asked otherwise.`,
      },
      {
        heading: 'Counting & Radix Sort',
        body: `When elements come from a bounded range, you can beat O(n log n):

Counting sort: count occurrences of each value, then reconstruct. O(n + k) where k = value range.

\`\`\`python
def counting_sort(nums, max_val):
    count = [0] * (max_val + 1)
    for n in nums: count[n] += 1
    result = []
    for val, freq in enumerate(count):
        result.extend([val] * freq)
    return result
\`\`\`

Dutch National Flag (3-way partition) is a counting-sort specialisation for 3 distinct values (0, 1, 2 in Sort Colors).`,
        codeByLang: [
          {
            javascript: `function countingSort(nums, maxVal) {
    const count = new Array(maxVal + 1).fill(0);
    for (const n of nums) count[n]++;
    const result = [];
    count.forEach((freq, val) => { for (let i = 0; i < freq; i++) result.push(val); });
    return result;
}`,
            java: `int[] countingSort(int[] nums, int maxVal) {
    int[] count = new int[maxVal + 1];
    for (int n : nums) count[n]++;
    int[] result = new int[nums.length]; int k = 0;
    for (int val = 0; val <= maxVal; val++)
        for (int f = 0; f < count[val]; f++) result[k++] = val;
    return result;
}`,
            cpp: `vector<int> countingSort(vector<int>& nums, int maxVal) {
    vector<int> count(maxVal + 1, 0);
    for (int n : nums) count[n]++;
    vector<int> result;
    for (int val = 0; val <= maxVal; val++)
        for (int f = 0; f < count[val]; f++) result.push_back(val);
    return result;
}`,
          },
        ],
      },
    ],
  },
  // ── Expanded curriculum ──────────────────────────────────────────────────
  {
    slug: 'heaps-and-priority-queues',
    title: 'Heaps & Priority Queues',
    track: 'data-structures',
    trackOrder: 5,
    category: 'heaps',
    categoryLabel: 'Heaps',
    difficulty: 'intermediate',
    summary: 'Master priority queues and learn how binary heaps enable logarithmic insertion and constant-time peek.',
    timeEstimate: 12,
    relatedProblems: ['kth-largest-element-in-an-array'],
    content: [
      {
        heading: 'Priority Queue Abstraction',
        body: `A standard queue is FIFO (First-In, First-Out). A priority queue operates differently: every element has a priority, and the element with the highest priority is dequeued first.

Common use-cases:
• Operating system task scheduling
• Dijkstra's shortest path algorithm
• Event-driven simulations`,
      },
      {
        heading: 'Binary Heaps & Array Layout',
        body: `A Binary Heap is a complete binary tree that satisfies the heap property:
• Min-Heap: Every node is ≥ its parent. The smallest element is at the root.
• Max-Heap: Every node is ≤ its parent. The largest element is at the root.

Because it is a complete binary tree, we store it in a flat array:
For node at index i:
• Left child: 2i + 1
• Right child: 2i + 2
• Parent: (i - 1) / 2

\`\`\`python
import heapq
nums = [3, 1, 4, 5, 9]
heapq.heapify(nums)       # O(n) heap creation
print(nums[0])            # O(1) peek minimum → 1
heapq.heappush(nums, 2)   # O(log n) insertion
min_val = heapq.heappop(nums) # O(log n) extraction
\`\`\``,
        codeByLang: [
          {
            javascript: `// JavaScript has no built-in heap; standard arrays are often used
const minHeap = [1, 3, 4, 5, 9];
console.log(minHeap[0]); // Peek minimum: O(1)
// Insertion: O(log n) bubble-up
// Extraction: O(log n) sink-down`,
            java: `PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.add(3); minHeap.add(1); minHeap.add(4);
int minVal = minHeap.peek(); // O(1) peek -> 1
minHeap.poll(); // O(log n) extract`,
            cpp: `priority_queue<int, vector<int>, greater<int>> minHeap;
minHeap.push(3); minHeap.push(1); minHeap.push(4);
int minVal = minHeap.top(); // O(1) peek -> 1
minHeap.pop(); // O(log n) extract`
          }
        ]
      }
    ]
  },
  {
    slug: 'tries-prefix-trees',
    title: 'Tries (Prefix Trees)',
    track: 'data-structures',
    trackOrder: 6,
    category: 'tries',
    categoryLabel: 'Tries',
    difficulty: 'advanced',
    summary: 'Understand prefix-based string structures and learn how to optimize vocabulary searches in O(L) time.',
    timeEstimate: 15,
    relatedProblems: ['implement-trie'],
    content: [
      {
        heading: 'What is a Trie?',
        body: `A Trie (prefix tree) is a specialized tree structure used to store and retrieve keys in a dataset of strings. 
Unlike a hash table, where strings are hashed as single values, in a trie, each node represents a single character, and paths from root to node spell out substrings or words.

Tries are extremely fast: searching for a word of length L takes O(L) time, which is independent of the number of words stored!`,
      },
      {
        heading: 'Node Structure & Operations',
        body: `Each trie node contains:
• A map or array of children (e.g., character 'a' to 'z')
• A boolean flag 'isWord' to mark if the node marks the end of a valid word

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
\`\`\``,
        codeByLang: [
          {
            javascript: `class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
    }
}`,
            java: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}`,
            cpp: `struct TrieNode {
    TrieNode* children[26] = {nullptr};
    bool isWord = false;
};`
          }
        ]
      }
    ]
  },
  {
    slug: 'graphs-basics',
    title: 'Graphs & Traversals',
    track: 'data-structures',
    trackOrder: 7,
    category: 'graphs',
    categoryLabel: 'Graphs',
    difficulty: 'intermediate',
    summary: 'Learn graph representations (adjacency lists vs. matrices) and how to navigate networks using BFS and DFS.',
    timeEstimate: 14,
    relatedProblems: ['number-of-islands'],
    content: [
      {
        heading: 'Graph Representation',
        body: `A graph is a set of vertices (nodes) and edges connecting them. 
There are two main representations:
• Adjacency Matrix: A 2D array where matrix[i][j] is 1 if there is an edge between i and j. (O(V²) space).
• Adjacency List: An array of lists where list[i] contains all neighbors of node i. (O(V + E) space - much preferred for sparse graphs!).`,
      },
      {
        heading: 'BFS and DFS Traversals',
        body: `To traverse a graph:
• Breadth-First Search (BFS): Uses a Queue. Explores level by level (perfect for finding the shortest path in unweighted graphs).
• Depth-First Search (DFS): Uses Recursion or a Stack. Goes deep into a path before backtracking.

\`\`\`python
# Graph DFS traversal
def dfs(node, graph, visited):
    if node in visited: return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, graph, visited)
\`\`\``,
        codeByLang: [
          {
            javascript: `function dfs(node, graph, visited) {
    if (visited.has(node)) return;
    visited.add(node);
    for (const neighbor of graph[node]) {
        dfs(neighbor, graph, visited);
    }
}`,
            java: `void dfs(int node, List<List<Integer>> graph, Set<Integer> visited) {
    if (visited.contains(node)) return;
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        dfs(neighbor, graph, visited);
    }
}`,
            cpp: `void dfs(int node, const vector<vector<int>>& graph, unordered_set<int>& visited) {
    if (visited.count(node)) return;
    visited.insert(node);
    for (int neighbor : graph[node]) {
        dfs(neighbor, graph, visited);
    }
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    track: 'algorithms',
    trackOrder: 11,
    category: 'bit-manipulation',
    categoryLabel: 'Bits',
    difficulty: 'intermediate',
    summary: 'Unlock the power of binary arithmetic, masks, and bitwise logic gates for high-performance computing.',
    timeEstimate: 10,
    relatedProblems: ['single-number'],
    content: [
      {
        heading: 'Bitwise Operators',
        body: `Computers represent everything in binary. Bitwise operators let you manipulate bits directly:
• AND (\`&\`): 1 if both bits are 1.
• OR (\`|\`): 1 if either bit is 1.
• XOR (\`^\`): 1 if bits differ. (Crucial property: x ^ x = 0, and x ^ 0 = x!)
• NOT (\`~\`): Inverts all bits.
• Shifts (\`<<\`, \`>>\`): Shift bit representations left or right (effectively multiplying or dividing by powers of 2).`,
      },
      {
        heading: 'Common Hacks',
        body: `Some extremely useful bit patterns:
• Check if power of two: \`n & (n - 1) == 0\`
• Clear lowest set bit: \`n & (n - 1)\`
• Get unique element (XOR): xor all elements of an array. Pairs cancel out, leaving the unique element.

\`\`\`python
# Check if power of 2
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
\`\`\``,
        codeByLang: [
          {
            javascript: `function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}`,
            java: `boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
            cpp: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    track: 'algorithms',
    trackOrder: 12,
    category: 'greedy',
    categoryLabel: 'Greedy',
    difficulty: 'intermediate',
    summary: 'Solve optimization problems by making locally optimal choices that lead to a global solution.',
    timeEstimate: 11,
    relatedProblems: ['best-time-to-buy-and-sell-stock'],
    content: [
      {
        heading: 'What is Greedy?',
        body: `A greedy algorithm builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit (local optimum).

Unlike Dynamic Programming, greedy never reconsiders past choices.
• Pros: Simple, fast (often O(N log N) or O(N)), easy to code.
• Cons: It does NOT always yield the globally optimal solution. Proof of correctness is vital!`,
      },
      {
        heading: 'A Classic Example: Interval Scheduling',
        body: `Problem: You have N meetings with start and end times. Find the maximum meetings you can attend in one room.
Greedy rule: Always pick the meeting that finishes earliest. This leaves maximum time for subsequent meetings!

\`\`\`python
def max_meetings(meetings):
    # Sort meetings by end time
    meetings.sort(key=lambda x: x[1])
    count, last_end = 0, -1
    for start, end in meetings:
        if start >= last_end:
            count += 1
            last_end = end
    return count
\`\`\``,
        codeByLang: [
          {
            javascript: `function maxMeetings(meetings) {
    meetings.sort((a, b) => a[1] - b[1]);
    let count = 0, lastEnd = -1;
    for (const [start, end] of meetings) {
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    return count;
}`,
            java: `int maxMeetings(int[][] meetings) {
    Arrays.sort(meetings, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 0, lastEnd = -1;
    for (int[] m : meetings) {
        if (m[0] >= lastEnd) {
            count++;
            lastEnd = m[1];
        }
    }
    return count;
}`,
            cpp: `int maxMeetings(vector<pair<int, int>>& meetings) {
    sort(meetings.begin(), meetings.end(), [](const auto& a, const auto& b) {
        return a.second < b.second;
    });
    int count = 0, lastEnd = -1;
    for (const auto& m : meetings) {
        if (m.first >= lastEnd) {
            count++;
            lastEnd = m.second;
        }
    }
    return count;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'graph-pathfinding',
    title: 'Graph Pathfinding (Dijkstra)',
    track: 'algorithms',
    trackOrder: 13,
    category: 'graphs',
    categoryLabel: 'Graphs',
    difficulty: 'advanced',
    summary: "Discover shortest paths in weighted networks using Dijkstra's greedy priority queue technique.",
    timeEstimate: 16,
    relatedProblems: ['number-of-islands'],
    content: [
      {
        heading: 'Shortest Path on Weighted Graphs',
        body: `BFS can find shortest paths if all edge weights are equal (each step = 1). If edges have custom weights, BFS fails!
We use Dijkstra's Algorithm: a greedy technique that finds the shortest path from a starting source node to all other nodes in O((V + E) log V) time.`,
      },
      {
        heading: 'Dijkstra Implementation',
        body: `Algorithm steps:
1. Maintain a min-priority queue of (distance, node) initialized with (0, source).
2. Maintain a dist map mapping each node to infinity, with dist[source] = 0.
3. Continually extract the minimum-distance node u.
4. For each neighbor v, if dist[u] + weight(u,v) < dist[v], update dist[v] and push v onto priority queue.

\`\`\`python
import heapq
def dijkstra(graph, start, V):
    dist = [float('inf')] * V
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for neighbor, weight in graph[u]:
            if dist[u] + weight < dist[neighbor]:
                dist[neighbor] = dist[u] + weight
                heapq.heappush(pq, (dist[neighbor], neighbor))
    return dist
\`\`\``,
        codeByLang: [
          {
            javascript: `function dijkstra(graph, start, V) {
    const dist = new Array(V).fill(Infinity);
    dist[start] = 0;
    // Uses simple queue wrapper in JS since heapq is missing
    const pq = [[0, start]];
    while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();
        if (d > dist[u]) continue;
        for (const [neighbor, weight] of graph[u]) {
            if (dist[u] + weight < dist[neighbor]) {
                dist[neighbor] = dist[u] + weight;
                pq.push([dist[neighbor], neighbor]);
            }
        }
    }
    return dist;
}`,
            java: `int[] dijkstra(List<List<int[]>> graph, int start, int V) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
    pq.add(new int[]{0, start});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (d > dist[u]) continue;
        for (int[] edge : graph.get(u)) {
            int neighbor = edge[0], weight = edge[1];
            if (dist[u] + weight < dist[neighbor]) {
                dist[neighbor] = dist[u] + weight;
                pq.add(new int[]{dist[neighbor], neighbor});
            }
        }
    }
    return dist;
}`,
            cpp: `vector<int> dijkstra(const vector<vector<pair<int, int>>>& graph, int start, int V) {
    vector<int> dist(V, INT_MAX);
    dist[start] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (const auto& edge : graph[u]) {
            int neighbor = edge.first, weight = edge.second;
            if (dist[u] + weight < dist[neighbor]) {
                dist[neighbor] = dist[u] + weight;
                pq.push({dist[neighbor], neighbor});
            }
        }
    }
    return dist;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'union-find-dsu',
    title: 'Union-Find / DSU',
    track: 'algorithms',
    trackOrder: 14,
    category: 'union-find',
    categoryLabel: 'DSU',
    difficulty: 'advanced',
    summary: 'Learn disjoint-set logic with path compression and rank optimization for near-constant grouping operations.',
    timeEstimate: 13,
    relatedProblems: ['number-of-islands'],
    content: [
      {
        heading: 'What is DSU?',
        body: `A Disjoint Set Union (DSU) or Union-Find data structure tracks a partition of elements into mutually disjoint sets. 
It supports two highly optimized operations:
• **Find**: Identify which set an element belongs to.
• **Union**: Merge two sets together.

With **Path Compression** and **Union by Rank**, these operations take near-constant O(α(N)) time (where α is the inverse Ackermann function, practically ≤ 4!).`,
      },
      {
        heading: 'Path Compression & Union',
        body: `Path compression works during **Find**: it updates parents of all traversed nodes directly to the root, flatting the tree!

\`\`\`python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1
\`\`\``,
        codeByLang: [
          {
            javascript: `class DSU {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }
    union(i, j) {
        let rI = this.find(i), rJ = this.find(j);
        if (rI !== rJ) {
            if (this.rank[rI] < this.rank[rJ]) this.parent[rI] = rJ;
            else if (this.rank[rI] > this.rank[rJ]) this.parent[rJ] = rI;
            else { this.parent[rJ] = rI; this.rank[rI]++; }
        }
    }
}`,
            java: `class DSU {
    int[] parent; int[] rank;
    DSU(int n) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    void union(int i, int j) {
        int rI = find(i), rJ = find(j);
        if (rI != rJ) {
            if (rank[rI] < rank[rJ]) parent[rI] = rJ;
            else if (rank[rI] > rank[rJ]) parent[rJ] = rI;
            else { parent[rJ] = rI; rank[rI]++; }
        }
    }
}`,
            cpp: `class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) {
        parent.resize(n); rank.resize(n, 0);
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    void unionSets(int i, int j) {
        int rI = find(i), rJ = find(j);
        if (rI != rJ) {
            if (rank[rI] < rank[rJ]) parent[rI] = rJ;
            else if (rank[rI] > rank[rJ]) parent[rJ] = rI;
            else { parent[rJ] = rI; rank[rI]++; }
        }
    }
};`
          }
        ]
      }
    ]
  },
  {
    slug: 'oop-principles',
    title: 'Object-Oriented Programming (OOP)',
    track: 'core-cs',
    trackOrder: 1,
    category: 'oop',
    categoryLabel: 'OOP',
    difficulty: 'beginner',
    summary: 'Master the four pillars of object-oriented architecture: Abstraction, Encapsulation, Inheritance, and Polymorphism.',
    timeEstimate: 9,
    relatedProblems: ['implement-trie'],
    content: [
      {
        heading: 'The Four Pillars',
        body: `OOP models code as interactive objects. The structural blueprint is a Class.
Four core principles underpin great object designs:
1. **Encapsulation**: Bundle data (attributes) and operations (methods) inside an object, shielding raw state access (e.g., using private variables and getters/setters).
2. **Abstraction**: Hide complex internal details and only expose simple interfaces.
3. **Inheritance**: Allow a subclass to inherit attributes and methods of a parent class to maximize reuse.
4. **Polymorphism**: Permit subclasses to implement unique behaviors for identical method signatures.`,
      },
      {
        heading: 'An OOP Showcase',
        body: `Let's construct a simple polymorphic animals model illustrating classes, constructors, encapsulation, inheritance, and method overriding.

\`\`\`python
class Animal:
    def __init__(self, name):
        self._name = name  # Protected encapsulation

    def make_sound(self):
        return "Generic sound"

class Dog(Animal):
    def make_sound(self):
        return f"{self._name} says Woof!"  # Polymorphic override
\`\`\``,
        codeByLang: [
          {
            javascript: `class Animal {
    constructor(name) {
        this._name = name;
    }
    makeSound() { return "Generic sound"; }
}
class Dog extends Animal {
    makeSound() { return \`\${this._name} says Woof!\`; }
}`,
            java: `class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String makeSound() { return "Generic sound"; }
}
class Dog extends Animal {
    public Dog(String name) { super(name); }
    @Override
    public String makeSound() { return name + " says Woof!"; }
}`,
            cpp: `class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) {}
    virtual string makeSound() { return "Generic sound"; }
};
class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}
    string makeSound() override { return name + " says Woof!"; }
};`
          }
        ]
      }
    ]
  },
  {
    slug: 'os-basics',
    title: 'Operating Systems & Concurrency',
    track: 'core-cs',
    trackOrder: 2,
    category: 'operating-systems',
    categoryLabel: 'Systems',
    difficulty: 'intermediate',
    summary: 'Explore processes, threads, synchronization locks, race conditions, and deadlocks.',
    timeEstimate: 14,
    relatedProblems: ['climbing-stairs'],
    content: [
      {
        heading: 'Processes vs. Threads',
        body: `An operating system manages execution units:
• **Process**: An isolated, independent execution environment. It has its own dedicated memory space (heap, stack). Crashing one process doesn't affect others.
• **Thread**: The smallest execution unit inside a process. All threads of a process share the same heap memory but have separate stacks. Threads are fast to create and context-switch, but sharing memory introduces synchronization risks!`,
      },
      {
        heading: 'Race Conditions, Locks, and Deadlocks',
        body: `Concurrency hazards:
• **Race Condition**: Multiple threads modify shared memory simultaneously. The final state depends on execution order (unpredictable!).
• **Mutex / Lock**: A mechanism ensuring only one thread accesses a critical section of code at a time.
• **Deadlock**: Thread A holds Lock 1 and waits for Lock 2. Thread B holds Lock 2 and waits for Lock 1. Both freeze forever!

\`\`\`python
import threading

lock = threading.Lock()
counter = 0

def increment():
    global counter
    with lock:  # Thread-safe critical section
        counter += 1
\`\`\``,
        codeByLang: [
          {
            javascript: `// JS is single-threaded (event loop) but uses Web Workers for multi-processing.
// Async operations are scheduled; race conditions happen on shared global resources.`,
            java: `class ThreadSafeCounter {
    private int counter = 0;
    public synchronized void increment() { // Synchronized lock
        counter++;
    }
}`,
            cpp: `#include <mutex>
int counter = 0;
std::mutex mtx;
void increment() {
    std::lock_guard<std::mutex> lock(mtx); // RAII Mutex Lock
    counter++;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'databases-sql',
    title: 'Database Design & SQL',
    track: 'core-cs',
    trackOrder: 3,
    category: 'databases',
    categoryLabel: 'Databases',
    difficulty: 'intermediate',
    summary: 'Master SQL databases, schema normalization, ACID transactions, and indexing strategies.',
    timeEstimate: 12,
    relatedProblems: ['two-sum'],
    content: [
      {
        heading: 'Relational vs. NoSQL',
        body: `Data stores fall into two broad buckets:
• **Relational (SQL)**: Structured tables, schemas, relations (foreign keys), strict transactions. Perfect for applications requiring high integrity (e.g., banking). Examples: Postgres, SQLite.
• **Non-Relational (NoSQL)**: Document, key-value, or graph structures. Highly scalable, dynamic schemas. Examples: MongoDB, Redis.`,
      },
      {
        heading: 'Indexes & ACID Transactions',
        body: `To make databases fast and reliable, we rely on:
• **Indexes**: Data structures (typically B-Trees) built on columns to speed up lookups from O(N) to O(log N). However, indexes slow down writes!
• **ACID Transactions**:
  • **Atomicity**: Entire transaction succeeds or entire transaction fails (no partial updates).
  • **Consistency**: State changes must preserve integrity constraints.
  • **Isolation**: Concurrent transactions execute without interfering.
  • **Durability**: Committed data is saved permanently.

\`\`\`sql
-- SQL Query to get top users
SELECT u.id, u.username, COUNT(s.id) as sessions_completed
FROM users u
JOIN sessions s ON u.id = s.user_id
WHERE s.status = 'completed'
GROUP BY u.id
ORDER BY sessions_completed DESC;
\`\`\``,
        codeByLang: [
          {
            javascript: `// SQL Query representation in JS ORM (e.g., Drizzle)
// db.select().from(users).innerJoin(sessions, eq(users.id, sessions.userId))...`
          }
        ]
      }
    ]
  },
  {
    slug: 'networks-protocols',
    title: 'Computer Networks & HTTP',
    track: 'core-cs',
    trackOrder: 4,
    category: 'networks',
    categoryLabel: 'Networks',
    difficulty: 'beginner',
    summary: 'Deconstruct web networking: the TCP/IP stack, DNS lookup routing, and HTTP/HTTPS client-server protocol.',
    timeEstimate: 10,
    relatedProblems: ['valid-palindrome'],
    content: [
      {
        heading: 'OSI vs. TCP/IP Models',
        body: `Data traverses the network through layered stacks:
1. **Application Layer**: User interaction (HTTP, DNS, SMTP).
2. **Transport Layer**: End-to-end reliability.
   • **TCP**: Connection-oriented, guarantees delivery, order preservation, slower (handshake).
   • **UDP**: Connectionless, fires-and-forgets, faster, prone to packet loss (gaming, streaming).
3. **Network Layer**: IP routing (IP packets, routers).
4. **Link Layer**: Physical cable transmission (Ethernet, Wi-Fi).`,
      },
      {
        heading: 'DNS & HTTP Protocol',
        body: `When you visit a URL:
1. **DNS Lookup**: Resolves hostname (e.g., \`google.com\`) into an IP address.
2. **TCP Connection**: Three-way handshake (SYN, SYN-ACK, ACK).
3. **TLS Handshake**: Secure cryptographic keys exchange (HTTPS).
4. **HTTP Request/Response**: Client requests resource, server replies.

\`\`\`python
import urllib.request
# Fetch a webpage over HTTP
response = urllib.request.urlopen("https://example.com")
html = response.read().decode('utf-8')
\`\`\``,
        codeByLang: [
          {
            javascript: `// Fetching resource in JavaScript
fetch("https://example.com")
  .then(res => res.text())
  .then(html => console.log(html));`,
            java: `// Fetching in Java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://example.com")).build();
String html = client.send(request, BodyHandlers.ofString()).body();`,
            cpp: `// C++ requires a library like libcurl or cpp-httplib
// httplib::Client cli("example.com");
// auto res = cli.Get("/");`
          }
        ]
      }
    ]
  },
  {
    slug: 'doubly-linked-lists',
    title: 'Doubly Linked Lists & Sentinels',
    track: 'data-structures',
    trackOrder: 8,
    category: 'arrays',
    categoryLabel: 'Lists',
    difficulty: 'intermediate',
    summary: 'Master bidirectional traversal, sentinel node boundaries, and LRU Cache structures.',
    timeEstimate: 11,
    relatedProblems: ['linked-lists'],
    content: [
      {
        heading: 'Bidirectional Traversal',
        body: `Singly linked lists only point forward, making deletion at a node u slow because you must search for the predecessor.
A Doubly Linked List node contains two pointers: 'next' and 'prev'.

This enables:
• Bidirectional navigation (forward and backward).
• Constant-time deletion O(1) of any node when a reference is held!`,
      },
      {
        heading: 'Sentinel Nodes Pattern',
        body: `Boundary conditions (inserts at head or tail, empty lists) introduce messy null pointer checks.
Sentinels are dummy 'head' and 'tail' nodes that represent the boundaries. The actual list sits between them.

\`\`\`python
class DLLNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None
        self.prev = None

# Initialize list with sentinels
head, tail = DLLNode(), DLLNode()
head.next, tail.prev = tail, head
\`\`\``,
        codeByLang: [
          {
            javascript: `class DLLNode {
    constructor(val = 0) {
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}
const head = new DLLNode(), tail = new DLLNode();
head.next = tail; tail.prev = head;`,
            java: `class DLLNode {
    int val; DLLNode next; DLLNode prev;
    DLLNode(int val) { this.val = val; }
}
DLLNode head = new DLLNode(0);
DLLNode tail = new DLLNode(0);
head.next = tail; tail.prev = head;`,
            cpp: `struct DLLNode {
    int val; DLLNode* next = nullptr; DLLNode* prev = nullptr;
    DLLNode(int v) : val(v) {}
};
DLLNode* head = new DLLNode(0);
DLLNode* tail = new DLLNode(0);
head->next = tail; tail->prev = head;`
          }
        ]
      }
    ]
  },
  {
    slug: 'segment-trees',
    title: 'Segment Trees (Range Queries)',
    track: 'advanced',
    trackOrder: 5,
    category: 'trees',
    categoryLabel: 'Trees',
    difficulty: 'advanced',
    summary: 'Solve dynamic range sum, minimum, or maximum queries and updates in O(log n) logarithmic time.',
    timeEstimate: 18,
    relatedProblems: ['binary-tree-inorder-traversal'],
    content: [
      {
        heading: 'What is a Segment Tree?',
        body: `If you have a flat array, range sum queries are O(N) while updates are O(1). With Prefix Sums, range queries are O(1) but updates cost O(N).
A Segment Tree is a binary tree representing intervals/segments. It balances this trade-off, enabling both range queries and point updates in O(log N) time!`,
      },
      {
        heading: 'Tree Representation & Builds',
        body: `For an array of size N, the segment tree requires at most 4N nodes. The root node represents interval [0, N-1], and children split intervals in half:

\`\`\`python
class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.build(arr, 0, 0, self.n - 1)

    def build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self.build(arr, 2 * node + 1, start, mid)
        self.build(arr, 2 * node + 2, mid + 1, end)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
\`\`\``,
        codeByLang: [
          {
            javascript: `class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(0);
        this.build(arr, 0, 0, this.n - 1);
    }
    build(arr, node, start, end) {
        if (start === end) { this.tree[node] = arr[start]; return; }
        const mid = Math.floor((start + end) / 2);
        this.build(arr, 2 * node + 1, start, mid);
        this.build(arr, 2 * node + 2, mid + 1, end);
        this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
}`,
            java: `class SegmentTree {
    int[] tree; int n;
    SegmentTree(int[] arr) {
        n = arr.length; tree = new int[4 * n];
        build(arr, 0, 0, n - 1);
    }
    void build(int[] arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
}`,
            cpp: `class SegmentTree {
    vector<int> tree; int n;
    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size(); tree.resize(4 * n, 0);
        build(arr, 0, 0, n - 1);
    }
};`
          }
        ]
      }
    ]
  },
  {
    slug: 'monotonic-stack-queue',
    title: 'Monotonic Stacks & Queues',
    track: 'data-structures',
    trackOrder: 9,
    category: 'arrays',
    categoryLabel: 'Stacks',
    difficulty: 'intermediate',
    summary: 'Maintain sorted order inside stacks and queues to solve Next Greater Element and Sliding Window Maximum.',
    timeEstimate: 13,
    relatedProblems: ['merge-intervals'],
    content: [
      {
        heading: 'Monotonic Stack Paradigm',
        body: `A Monotonic Stack maintains its elements in a strictly sorted order (either strictly increasing or decreasing).
When a new element arrives, we pop elements that violate this sorting order before pushing the new element.

This lets us find the "next greater" or "next smaller" element for every item in an array in a single O(N) linear pass!`,
      },
      {
        heading: 'Next Greater Element Algorithm',
        body: `For every element in the array, find the first element to its right that is strictly larger:

\`\`\`python
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # holds indices
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            idx = stack.pop()
            res[idx] = num
        stack.append(i)
    return res
\`\`\``,
        codeByLang: [
          {
            javascript: `function nextGreater(nums) {
    const res = new Array(nums.length).fill(-1);
    const stack = [];
    for (let i = 0; i < nums.length; i++) {
        while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
            const idx = stack.pop();
            res[idx] = nums[i];
        }
        stack.push(i);
    }
    return res;
}`,
            java: `int[] nextGreater(int[] nums) {
    int[] res = new int[nums.length];
    Arrays.fill(res, -1);
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            res[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return res;
}`,
            cpp: `vector<int> nextGreater(vector<int>& nums) {
    vector<int> res(nums.size(), -1);
    stack<int> s;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!s.empty() && nums[s.top()] < nums[i]) {
            res[s.top()] = nums[i];
            s.pop();
        }
        s.push(i);
    }
    return res;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'divide-and-conquer',
    title: 'Divide & Conquer Paradigm',
    track: 'algorithms',
    trackOrder: 15,
    category: 'recursion',
    categoryLabel: 'Paradigms',
    difficulty: 'intermediate',
    summary: 'Solve complex problems by breaking them into independent subproblems, solving recursively, and merging.',
    timeEstimate: 11,
    relatedProblems: ['climbing-stairs'],
    content: [
      {
        heading: 'Three Pillars of Divide & Conquer',
        body: `1. **Divide**: Break the large problem into smaller, independent subproblems of the same type.
2. **Conquer**: Solve the subproblems recursively. If they are small enough (base case), solve directly.
3. **Combine**: Merge subproblem solutions to build the final solution.

Classic examples: Merge Sort, Quick Sort, Binary Search, and Strassen's matrix multiplication.`,
      },
      {
        heading: 'Merge Sort Implementation',
        body: `Merge Sort splits the array in half, recursively sorts both halves, then merges them in linear time:

\`\`\`python
def merge_sort(nums):
    if len(nums) <= 1: return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    
    # Merge sorted halves
    res, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]: res.append(left[i]); i += 1
        else: res.append(right[j]); j += 1
    res.extend(left[i:]); res.extend(right[j:])
    return res
\`\`\``,
        codeByLang: [
          {
            javascript: `function mergeSort(nums) {
    if (nums.length <= 1) return nums;
    const mid = Math.floor(nums.length / 2);
    const left = mergeSort(nums.slice(0, mid));
    const right = mergeSort(nums.slice(mid));
    
    const res = []; let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) res.push(left[i++]);
        else res.push(right[j++]);
    }
    return res.concat(left.slice(i)).concat(right.slice(j));
}`,
            java: `// Java recursive division in-place
void mergeSort(int[] nums, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(nums, l, mid);
    mergeSort(nums, mid + 1, r);
    merge(nums, l, mid, r);
}`,
            cpp: `void mergeSort(vector<int>& nums, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(nums, l, mid);
    mergeSort(nums, mid + 1, r);
    inplace_merge(nums.begin() + l, nums.begin() + mid + 1, nums.begin() + r + 1);
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'topological-sort',
    title: 'Topological Sort (DAGs)',
    track: 'algorithms',
    trackOrder: 16,
    category: 'graphs',
    categoryLabel: 'Graphs',
    difficulty: 'advanced',
    summary: 'Linearly order vertices of Directed Acyclic Graphs (DAGs) to resolve course dependencies.',
    timeEstimate: 14,
    relatedProblems: ['number-of-islands'],
    content: [
      {
        heading: 'What is a Topological Sort?',
        body: `For a Directed Acyclic Graph (DAG), a topological sort is a linear ordering of vertices such that for every directed edge u → v, vertex u comes before v in the ordering.
This represents a sequence of prerequisite dependencies.

Important properties:
• Only possible if the graph has **no cycles** (cycles make topological ordering impossible!).
• A DAG can have multiple valid topological sort orderings.`,
      },
      {
        heading: "Kahn's Algorithm (BFS Indegree)",
        body: `Kahn's algorithm tracks 'indegrees' (number of incoming edges) for every vertex:
1. Put all vertices with indegree = 0 into a Queue.
2. Continually pop node u, append u to result.
3. For each neighbor v of u, decrement v's indegree. If indegree of v reaches 0, push v onto queue.
4. If result length != total vertices, the graph contains a cycle!

\`\`\`python
from collections import deque
def topo_sort(V, adj):
    indegree = [0] * V
    for u in range(V):
        for v in adj[u]: indegree[v] += 1
    
    q = deque([i for i in range(V) if indegree[i] == 0])
    res = []
    while q:
        u = q.popleft()
        res.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0: q.append(v)
    return res
\`\`\``,
        codeByLang: [
          {
            javascript: `function topoSort(V, adj) {
    const indegree = new Array(V).fill(0);
    for (let u = 0; u < V; u++) {
        for (const v of adj[u]) indegree[v]++;
    }
    const q = [];
    for (let i = 0; i < V; i++) { if (indegree[i] === 0) q.push(i); }
    const res = [];
    while (q.length) {
        const u = q.shift(); res.push(u);
        for (const v of adj[u]) {
            indegree[v]--;
            if (indegree[v] === 0) q.push(v);
        }
    }
    return res;
}`,
            java: `int[] topoSort(int V, List<List<Integer>> adj) {
    int[] indegree = new int[V];
    for (int u = 0; u < V; u++) {
        for (int v : adj.get(u)) indegree[v]++;
    }
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < V; i++) { if (indegree[i] == 0) q.add(i); }
    int[] res = new int[V]; int idx = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); res[idx++] = u;
        for (int v : adj.get(u)) {
            indegree[v]--;
            if (indegree[v] == 0) q.add(v);
        }
    }
    return res;
}`,
            cpp: `vector<int> topoSort(int V, const vector<vector<int>>& adj) {
    vector<int> indegree(V, 0);
    for (int u = 0; u < V; u++) {
        for (int v : adj[u]) indegree[v]++;
    }
    queue<int> q;
    for (int i = 0; i < V; i++) { if (indegree[i] == 0) q.push(i); }
    vector<int> res;
    while (!q.empty()) {
        int u = q.front(); q.pop(); res.push_back(u);
        for (int v : adj[u]) {
            indegree[v]--;
            if (indegree[v] == 0) q.push(v);
        }
    }
    return res;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'backtracking-deep-dive',
    title: 'Backtracking (Subsets & Combinations)',
    track: 'algorithms',
    trackOrder: 17,
    category: 'recursion',
    categoryLabel: 'Recursion',
    difficulty: 'intermediate',
    summary: 'Implement state space recursive path tree traversals to generate permutations, subsets, and combinations.',
    timeEstimate: 12,
    relatedProblems: ['climbing-stairs'],
    content: [
      {
        heading: 'The Backtracking Template',
        body: `Backtracking is an incremental depth-first brute-force search. It explores a choice, recursively tries all subsequent options, then un-makes (backtracks) that choice before trying alternative branches.

The classic structural recipe:
\`\`\`text
void backtrack(state, choices):
    if is_solution(state):
        add_to_output(state)
        return
    for choice in choices:
        if is_valid(choice):
            make_choice(state, choice)
            backtrack(state, choices)
            undo_choice(state, choice) // Backtrack!
\`\`\``,
      },
      {
        heading: 'Generating Subsets (Power Set)',
        body: `Generate all possible subsets (elements are optional: either include or exclude at each step):

\`\`\`python
def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])          # make choice
            backtrack(i + 1, path)        # recurse
            path.pop()                    # backtrack
    backtrack(0, [])
    return res
\`\`\``,
        codeByLang: [
          {
            javascript: `function subsets(nums) {
    const res = [];
    function backtrack(start, path) {
        res.push([...path]);
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    backtrack(0, []);
    return res;
}`,
            java: `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), res);
    return res;
}
void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, nums, path, res);
        path.remove(path.size() - 1);
    }
}`,
            cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res; vector<int> path;
    backtrack(0, nums, path, res);
    return res;
}
void backtrack(int start, const vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
    res.push_back(path);
    for (int i = start; i < (int)nums.size(); i++) {
        path.push_back(nums[i]);
        backtrack(i + 1, nums, path, res);
        path.pop_back();
    }
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'binary-search-on-answer',
    title: 'Binary Search on Answer Space',
    track: 'algorithms',
    trackOrder: 18,
    category: 'arrays',
    categoryLabel: 'Search',
    difficulty: 'intermediate',
    summary: 'Search inside a bounded output range using monotonic helper functions to solve optimization problems.',
    timeEstimate: 13,
    relatedProblems: ['best-time-to-buy-and-sell-stock'],
    content: [
      {
        heading: 'Monotonic Feasibility Functions',
        body: `Standard binary search operates on a sorted array of items. 
Binary Search on Answer operates on an **implicit output range** (e.g., [min_possible, max_possible] values). 

We define a monotonic validation helper: \`isPossible(x)\`.
If \`isPossible(x)\` is true, then for all values > x, it is also true (or false depending on the direction). This monotonicity allows us to discard half the search space at each interval!`,
      },
      {
        heading: 'Shipping Packages Example',
        body: `Problem: Find the minimum capacity of a ship to transport all packages within D days.
Output search space: [max(weights), sum(weights)].

\`\`\`python
def is_feasible(capacity, weights, days):
    d, current_weight = 1, 0
    for w in weights:
        if current_weight + w > capacity:
            d += 1
            current_weight = 0
        current_weight += w
    return d <= days

def ship_within_days(weights, days):
    left, right = max(weights), sum(weights)
    res = right
    while left <= right:
        mid = (left + right) // 2
        if is_feasible(mid, weights, days):
            res = mid
            right = mid - 1  # try to find a smaller feasible capacity
        else:
            left = mid + 1   # increase capacity
    return res
\`\`\``,
        codeByLang: [
          {
            javascript: `function isFeasible(capacity, weights, days) {
    let d = 1, curr = 0;
    for (const w of weights) {
        if (curr + w > capacity) { d++; curr = 0; }
        curr += w;
    }
    return d <= days;
}
function shipWithinDays(weights, days) {
    let left = Math.max(...weights), right = weights.reduce((a, b) => a + b, 0);
    let res = right;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (isFeasible(mid, weights, days)) { res = mid; right = mid - 1; }
        else left = mid + 1;
    }
    return res;
}`,
            java: `boolean isFeasible(int capacity, int[] weights, int days) {
    int d = 1, curr = 0;
    for (int w : weights) {
        if (curr + w > capacity) { d++; curr = 0; }
        curr += w;
    }
    return d <= days;
}
int shipWithinDays(int[] weights, int days) {
    int left = 0, right = 0;
    for (int w : weights) { left = Math.max(left, w); right += w; }
    int res = right;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (isFeasible(mid, weights, days)) { res = mid; right = mid - 1; }
        else left = mid + 1;
    }
    return res;
}`,
            cpp: `bool isFeasible(int capacity, const vector<int>& weights, int days) {
    int d = 1, curr = 0;
    for (int w : weights) {
        if (curr + w > capacity) { d++; curr = 0; }
        curr += w;
    }
    return d <= days;
}
int shipWithinDays(vector<int>& weights, int days) {
    int left = 0, right = 0;
    for (int w : weights) { left = max(left, w); right += w; }
    int res = right;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (isFeasible(mid, weights, days)) { res = mid; right = mid - 1; }
        else left = mid + 1;
    }
    return res;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'minimum-spanning-tree',
    title: 'Minimum Spanning Trees (MST)',
    track: 'advanced',
    trackOrder: 6,
    category: 'graphs',
    categoryLabel: 'Graphs',
    difficulty: 'advanced',
    summary: "Connect networks using Kruskal's greedy and Disjoint Set Union (DSU) algorithms.",
    timeEstimate: 16,
    relatedProblems: ['number-of-islands'],
    content: [
      {
        heading: 'What is an MST?',
        body: `A Spanning Tree of a connected graph is a subset of edges that connects all vertices together without any cycles.
A Minimum Spanning Tree (MST) is a spanning tree whose sum of edge weights is minimized.

Common algorithms:
• **Kruskal's Algorithm**: Greedy choices. Sorts all edges by weight, then processes edges. If the edge connects two separated components, we add it to our MST. Uses **DSU** to maintain components in near-constant time!`,
      },
      {
        heading: "Kruskal's Algorithm Implementation",
        body: `Kruskal's runs in O(E log E) time (dominated by sorting edges):

\`\`\`python
# Simple Kruskal implementation using our DSU structure
def kruskal(V, edges):
    edges.sort(key=lambda x: x[2])  # Sort by weight
    dsu = DSU(V)
    mst_weight, edges_used = 0, 0
    for u, v, w in edges:
        if dsu.find(u) != dsu.find(v):
            dsu.union(u, v)
            mst_weight += w
            edges_used += 1
            if edges_used == V - 1: break
    return mst_weight
\`\`\``,
        codeByLang: [
          {
            javascript: `function kruskal(V, edges) {
    edges.sort((a, b) => a[2] - b[2]);
    const dsu = new DSU(V);
    let weight = 0, count = 0;
    for (const [u, v, w] of edges) {
        if (dsu.find(u) !== dsu.find(v)) {
            dsu.union(u, v);
            weight += w;
            if (++count === V - 1) break;
        }
    }
    return weight;
}`,
            java: `int kruskal(int V, int[][] edges) {
    Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
    DSU dsu = new DSU(V);
    int weight = 0, count = 0;
    for (int[] e : edges) {
        if (dsu.find(e[0]) != dsu.find(e[1])) {
            dsu.union(e[0], e[1]);
            weight += e[2];
            if (++count == V - 1) break;
        }
    }
    return weight;
}`,
            cpp: `int kruskal(int V, vector<vector<int>>& edges) {
    sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) {
        return a[2] < b[2];
    });
    DSU dsu(V);
    int weight = 0, count = 0;
    for (const auto& e : edges) {
        if (dsu.find(e[0]) != dsu.find(e[1])) {
            dsu.unionSets(e[0], e[1]);
            weight += e[2];
            if (++count == V - 1) break;
        }
    }
    return weight;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'grid-dp',
    title: 'Grid Dynamic Programming',
    track: 'advanced',
    trackOrder: 7,
    category: 'recursion',
    categoryLabel: 'DP',
    difficulty: 'advanced',
    summary: 'Solve pathfinding and optimization problems on 2D matrix grids using recursive relation transitions.',
    timeEstimate: 14,
    relatedProblems: ['climbing-stairs'],
    content: [
      {
        heading: 'Transitions on 2D Grids',
        body: `Dynamic Programming on a 2D matrix involves solving subproblems defined by rows and columns: \`dp[i][j]\`.
Transitions usually only allow moving down or right, meaning the state \`dp[i][j]\` only depends on the subproblems \`dp[i-1][j]\` (from top) and \`dp[i][j-1]\` (from left).

This simplifies calculations: we can traverse row-by-row or column-by-column in O(M * N) time!`,
      },
      {
        heading: 'Unique Paths Algorithm',
        body: `Find the number of unique paths from the top-left corner of an m x n grid to the bottom-right corner:

\`\`\`python
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]
\`\`\``,
        codeByLang: [
          {
            javascript: `function uniquePaths(m, n) {
    const dp = Array.from({length: m}, () => new Array(n).fill(1));
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    return dp[m-1][n-1];
}`,
            java: `int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) Arrays.fill(dp[i], 1);
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    return dp[m-1][n-1];
}`,
            cpp: `int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    return dp[m-1][n-1];
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'knapsack-dp',
    title: 'Knapsack & Coin Change DP',
    track: 'advanced',
    trackOrder: 8,
    category: 'recursion',
    categoryLabel: 'DP',
    difficulty: 'advanced',
    summary: 'Solve the classical Knapsack state selection problem and unbounded variations in pseudo-linear time.',
    timeEstimate: 15,
    relatedProblems: ['climbing-stairs'],
    content: [
      {
        heading: '0/1 Knapsack Decision Spaces',
        body: `In the 0/1 Knapsack problem, you are given N items, each with a weight and value, and a knapsack of capacity W. For every item, you make a binary choice: either include (1) or exclude (0).
The subproblem state: \`dp[i][w]\` represents the maximum value using subset of first i items under capacity w.

State transition:
\`dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]])\` (if weight wt[i] ≤ w).`,
      },
      {
        heading: 'Unbounded Variations (Coin Change)',
        body: `In unbounded problems, items/coins can be reused an infinite number of times.
State transitions are calculated on a flat array of capacity space:

\`\`\`python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
\`\`\``,
        codeByLang: [
          {
            javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let x = coin; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - coin] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,
            java: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int coin : coins) {
        for (int x = coin; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
            cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int coin : coins) {
        for (int x = coin; x <= amount; x++) {
            dp[x] = min(dp[x], dp[x - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'system-design-caching',
    title: 'System Design: Caching Principles',
    track: 'core-cs',
    trackOrder: 5,
    category: 'system-design',
    categoryLabel: 'System',
    difficulty: 'intermediate',
    summary: 'Explore cache architectures, eviction policies (LRU, LFU), and application caching patterns.',
    timeEstimate: 10,
    relatedProblems: ['hash-maps'],
    content: [
      {
        heading: 'Why Cache?',
        body: `Caching is the practice of storing copies of frequently accessed data in a fast, temporary memory layer (typically RAM) to serve requests quicker than fetching from the primary database.

Benefits:
• Dramatically speeds up read operations.
• Protects database systems from massive read traffic spikes.
• Saves CPU cycles and networking bandwidth.`,
      },
      {
        heading: 'Eviction & Application Strategies',
        body: `Since RAM is expensive, memory size is restricted. We must evict stale data using:
• **LRU (Least Recently Used)**: Evict the item that was accessed longest ago.
• **LFU (Least Frequently Used)**: Evict the item accessed fewest times.

Application integration patterns:
• **Cache-Aside**: Application queries cache first. If missed, it queries DB and updates the cache.
• **Write-Through**: Application writes to cache, and cache writes directly to DB immediately.
• **Write-Back**: Application writes to cache, and database is updated asynchronously in batches later.

\`\`\`python
# Simple manual cache wrapper
class SimpleCache:
    def __init__(self):
        self.store = {}
    
    def get(self, key):
        return self.store.get(key)
    
    def set(self, key, val):
        self.store[key] = val
\`\`\``,
        codeByLang: [
          {
            javascript: `const cache = new Map();
function getCachedData(key) {
    return cache.get(key) || null;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'system-design-load-balancers',
    title: 'System Design: Load Balancers',
    track: 'core-cs',
    trackOrder: 6,
    category: 'system-design',
    categoryLabel: 'System',
    difficulty: 'intermediate',
    summary: 'Deconstruct request traffic routing and horizontal scaling via software load balancers.',
    timeEstimate: 9,
    relatedProblems: ['two-sum'],
    content: [
      {
        heading: 'Traffic Distribution',
        body: `A single server can only handle a finite number of requests before collapsing. 
To scale, we deploy multiple servers behind a **Load Balancer (LB)**. The LB acts as a traffic cop, routing incoming client requests to healthy backend servers.

This enables **Horizontal Scaling**: adding more standard servers to handle load increases, rather than upgrading to a single massive server (Vertical Scaling).`,
      },
      {
        heading: 'Routing Algorithms',
        body: `Load balancers distribute traffic using algorithms:
• **Round Robin**: Cycle through servers sequentially. (Assumes all servers have identical power).
• **Least Connections**: Route to the server with fewest active connections.
• **IP Hash**: Hash the client's IP address to route them to the exact same server consistently (preserves user session affinity!).

\`\`\`python
# Circular Round Robin representation
class RoundRobinLB:
    def __init__(self, servers):
        self.servers = servers
        self.idx = 0
    def route_request(self):
        srv = self.servers[self.idx]
        self.idx = (self.idx + 1) % len(self.servers)
        return srv
\`\`\``,
        codeByLang: [
          {
            javascript: `class RoundRobinLB {
    constructor(servers) {
        this.servers = servers;
        this.idx = 0;
    }
    route() {
        const srv = this.servers[this.idx];
        this.idx = (this.idx + 1) % this.servers.length;
        return srv;
    }
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'system-design-partitioning',
    title: 'System Design: Database Sharding',
    track: 'core-cs',
    trackOrder: 7,
    category: 'system-design',
    categoryLabel: 'System',
    difficulty: 'intermediate',
    summary: 'Learn horizontal sharding, consistent hashing, and split-join architectures.',
    timeEstimate: 11,
    relatedProblems: ['hash-maps'],
    content: [
      {
        heading: 'Horizontal Partitioning (Sharding)',
        body: `When your database table grows to hundreds of millions of rows, write performance degrades, and storage disk limits are breached.
**Sharding** is horizontal partitioning: splitting a single large table across multiple physical database machines.

Each machine holds a subset of the dataset. A **Shard Key** determines where a specific row is stored. If you query using the shard key, the application routes directly to that node (O(1) search!).`,
      },
      {
        heading: 'Consistent Hashing',
        body: `If you divide shards using simple modulo (\`id % N\`), adding or removing a database machine forces re-hashing and re-moving 99% of your data!
**Consistent Hashing** resolves this: it maps both shard machines and data keys onto a virtual circular ring. Adding a shard node only forces re-mapping a tiny fraction of adjacent keys, maximizing horizontal scalability!

\`\`\`python
# Simple sharding router
def get_shard_id(user_id, total_shards):
    # Shard routing based on modulo hash
    return hash(user_id) % total_shards
\`\`\``,
        codeByLang: [
          {
            javascript: `function getShardId(userId, totalShards) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % totalShards;
}`
          }
        ]
      }
    ]
  },
  {
    slug: 'functional-programming',
    title: 'Functional Programming Principles',
    track: 'core-cs',
    trackOrder: 8,
    category: 'paradigms',
    categoryLabel: 'Paradigms',
    difficulty: 'beginner',
    summary: 'Explore pure functions, immutability, first-class functions, and functional data transformation pipelines.',
    timeEstimate: 9,
    relatedProblems: ['valid-palindrome'],
    content: [
      {
        heading: 'The Core Concepts',
        body: `Functional Programming (FP) is a declarative coding paradigm where programs are constructed by applying and composing mathematical functions.

FP is built on four core principles:
1. **Pure Functions**: A function always produces the identical output for the identical input, and causes **no side-effects** (doesn't modify global variables, write to disks, or modify arguments).
2. **Immutability**: Once created, variables/data cannot be altered. Changes produce a modified copy.
3. **First-Class Functions**: Functions are treated as first-class citizens — they can be assigned to variables, passed as arguments, and returned from other functions.
4. **Declarative Pipelines**: Transforming arrays using pipelines instead of imperative loop counters (e.g., Map, Filter, Reduce).`,
      },
      {
        heading: 'Functional Transformation Pipeline',
        body: `Compare the imperative loop with a clean functional transformation pipeline:

\`\`\`python
# Imperative approach
doubles = []
for n in [1, 2, 3, 4]:
    if n % 2 == 0:
        doubles.append(n * 2)

# Declarative functional pipeline
nums = [1, 2, 3, 4]
doubles_fn = list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, nums)))
\`\`\``,
        codeByLang: [
          {
            javascript: `// JavaScript map-filter pipeline
const nums = [1, 2, 3, 4];
const doubles = nums
    .filter(x => x % 2 === 0)
    .map(x => x * 2);`,
            java: `// Java 8 Streams pipeline
List<Integer> nums = Arrays.asList(1, 2, 3, 4);
List<Integer> doubles = nums.stream()
    .filter(x -> x % 2 == 0)
    .map(x -> x * 2)
    .collect(Collectors.toList());`,
            cpp: `// C++20 Ranges pipeline
vector<int> nums = {1, 2, 3, 4};
auto doubles = nums 
    | views::filter([](int x) { return x % 2 == 0; })
    | views::transform([](int x) { return x * 2; });`
          }
        ]
      }
    ]
  },
  {
    slug: 'big-o-advanced',
    title: 'Big O Deep Dive & Master Theorem',
    track: 'foundations',
    trackOrder: 4,
    category: 'foundations',
    categoryLabel: 'Theory',
    difficulty: 'intermediate',
    summary: 'Deconstruct advanced complexity recurrences and apply the Master Theorem to divide and conquer runtimes.',
    timeEstimate: 11,
    relatedProblems: ['climbing-stairs'],
    content: [
      {
        heading: 'Recurrence Relations',
        body: `When an algorithm calls itself recursively (like Merge Sort), we express its runtime as a recurrence relation:
\`T(n) = 2T(n/2) + O(n)\` (meaning: it splits into 2 subproblems of size n/2, plus linear time to merge).

Solving these by drawing recursive trees or unfolding recurrences manually can be slow and tedious. Enter the **Master Theorem**!`,
      },
      {
        heading: 'The Master Theorem',
        body: `For recurrence relations of the form:
\`T(n) = aT(n/b) + f(n)\` (where a ≥ 1 represents subproblems, b > 1 represents the division factor, and f(n) represents combine/divide work).

We compare \`f(n)\` with \`n^(log_b a)\`:
• Case 1: If \`f(n) = O(n^c)\` where \`c < log_b a\`, then \`T(n) = Θ(n^(log_b a))\`.
• Case 2: If \`f(n) = Θ(n^(log_b a) * log^k n)\` where \`k ≥ 0\`, then \`T(n) = Θ(n^(log_b a) * log^(k+1) n)\`. (Merge Sort matches this Case 2: \`T(n) = 2T(n/2) + O(n)\` → \`T(n) = O(n log n)\`!).
• Case 3: If \`f(n) = Ω(n^c)\` where \`c > log_b a\`, then \`T(n) = Θ(f(n))\`.

\`\`\`python
# Binary Search recurrence: T(n) = T(n/2) + O(1)
# a = 1, b = 2, f(n) = O(1)
# n^(log_2 1) = n^0 = 1. Matches Case 2 with k = 0.
# Result: T(n) = O(log n)
\`\`\``,
        codeByLang: [
          {
            javascript: `// Binary Search recurrence visual
// T(n) = T(n/2) + O(1) -> O(log n) complexity.`
          }
        ]
      }
    ]
  }
]


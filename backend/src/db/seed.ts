import 'dotenv/config'
import { db } from './client'
import { topics, problems, problemTopics, playlists, playlistProblems } from './schema'

const topicData = [
  { name: 'Arrays', slug: 'arrays' },
  { name: 'Strings', slug: 'strings' },
  { name: 'Hash Maps', slug: 'hash-maps' },
  { name: 'Two Pointers', slug: 'two-pointers' },
  { name: 'Sliding Window', slug: 'sliding-window' },
  { name: 'Recursion', slug: 'recursion' },
  { name: 'Trees', slug: 'trees' },
  { name: 'Sorting', slug: 'sorting' },
  { name: 'Heaps & Priority Queues', slug: 'heaps' },
  { name: 'Tries', slug: 'tries' },
  { name: 'Bit Manipulation', slug: 'bit-manipulation' },
  { name: 'Graphs', slug: 'graphs' },
  { name: 'Greedy Algorithms', slug: 'greedy' },
  { name: 'Union-Find / DSU', slug: 'union-find' },
  { name: 'Object-Oriented Programming', slug: 'oop' },
  { name: 'Operating Systems', slug: 'operating-systems' },
  { name: 'Databases', slug: 'databases' },
  { name: 'Computer Networks', slug: 'networks' },
]

const problemData = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy' as const,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers that add up to \`target\`.

You may assume each input has exactly one solution, and you may not use the same element twice.`,
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
    constraints: `- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
- Only one valid answer exists`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explain: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]', explain: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    topicSlugs: ['arrays', 'hash-maps'],
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'easy' as const,
    description: `A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`True\` if it is a palindrome, or \`False\` otherwise.`,
    starterCode: `def is_palindrome(s: str) -> bool:
    # Your code here
    pass`,
    constraints: `- 1 ≤ s.length ≤ 2 × 10⁵
- s consists only of printable ASCII characters`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'True', explain: '"amanaplanacanalpanama" is a palindrome' },
      { input: 's = "race a car"', output: 'False', explain: '"raceacar" is not a palindrome' },
    ],
    topicSlugs: ['strings', 'two-pointers'],
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy' as const,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy and a **later** day to sell. Return the maximum profit. If no profit is possible, return \`0\`.`,
    starterCode: `def max_profit(prices: list[int]) -> int:
    # Your code here
    pass`,
    constraints: `- 1 ≤ prices.length ≤ 10⁵
- 0 ≤ prices[i] ≤ 10⁴`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explain: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explain: 'Prices only fall, no profit possible.' },
    ],
    topicSlugs: ['arrays', 'sliding-window'],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'medium' as const,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    starterCode: `def length_of_longest_substring(s: str) -> int:
    # Your code here
    pass`,
    constraints: `- 0 ≤ s.length ≤ 5 × 10⁴
- s consists of English letters, digits, symbols and spaces`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explain: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explain: 'The answer is "b", with the length of 1.' },
    ],
    topicSlugs: ['strings', 'sliding-window', 'hash-maps'],
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'medium' as const,
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

An anagram is a word or phrase formed by rearranging the letters of another word.`,
    starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass`,
    constraints: `- 1 ≤ strs.length ≤ 10⁴
- 0 ≤ strs[i].length ≤ 100
- strs[i] consists of lowercase English letters`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explain: 'eat, tea, and ate are all anagrams of each other.' },
      { input: 'strs = [""]', output: '[[""]]', explain: 'Single empty string.' },
    ],
    topicSlugs: ['strings', 'hash-maps', 'sorting'],
  },
  {
    title: 'Binary Tree Inorder Traversal',
    slug: 'binary-tree-inorder-traversal',
    difficulty: 'easy' as const,
    description: `Given the \`root\` of a binary tree, return the **inorder traversal** of its nodes' values (left → root → right).

Use the provided \`TreeNode\` class below.`,
    starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: TreeNode | None) -> list[int]:
    # Your code here
    pass`,
    constraints: `- The number of nodes is in the range [0, 100]
- -100 ≤ Node.val ≤ 100`,
    examples: [
      { input: 'root = [1,null,2,3]', output: '[1,3,2]', explain: 'Inorder: left, root, right.' },
      { input: 'root = []', output: '[]', explain: 'Empty tree returns empty list.' },
    ],
    topicSlugs: ['trees', 'recursion'],
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'easy' as const,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb \`1\` or \`2\` steps.

In how many distinct ways can you climb to the top?`,
    starterCode: `def climb_stairs(n: int) -> int:
    # Your code here
    pass`,
    constraints: `- 1 ≤ n ≤ 45`,
    examples: [
      { input: 'n = 2', output: '2', explain: '1+1 or 2. Two ways.' },
      { input: 'n = 3', output: '3', explain: '1+1+1, 1+2, or 2+1. Three ways.' },
    ],
    topicSlugs: ['recursion'],
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'medium' as const,
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    starterCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Your code here
    pass`,
    constraints: `- 1 ≤ intervals.length ≤ 10⁴
- intervals[i].length == 2
- 0 ≤ start_i ≤ end_i ≤ 10⁴`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explain: '[1,3] and [2,6] overlap → merged to [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explain: '[1,4] and [4,5] are considered overlapping.' },
    ],
    topicSlugs: ['arrays', 'sorting'],
  },
  {
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'easy' as const,
    description: `Given a **non-empty** array of integers \`nums\`, every element appears twice except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    starterCode: `def single_number(nums: list[int]) -> int:
    # Your code here
    pass`,
    constraints: `- 1 ≤ nums.length ≤ 3 × 10⁴
- -3 × 10⁴ ≤ nums[i] ≤ 3 × 10⁴
- Each element in the array appears twice except for one element which appears only once.`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1', explain: '1 is the only number that does not repeat.' },
      { input: 'nums = [4,1,2,1,2]', output: '4', explain: '4 is the unique element.' },
    ],
    topicSlugs: ['arrays', 'bit-manipulation'],
  },
  {
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    difficulty: 'medium' as const,
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`th largest element in the array.

Note that it is the \`k\`th largest element in the sorted order, not the \`k\`th distinct element.

Can you solve it without sorting in O(n log k) or O(n) time?`,
    starterCode: `def find_kth_largest(nums: list[int], k: int) -> int:
    # Your code here
    pass`,
    constraints: `- 1 ≤ k ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explain: 'The sorted array is [1,2,3,4,5,6] and the 2nd largest element is 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explain: 'The sorted array is [1,2,2,3,3,4,5,5,6] and the 4th largest element is 4.' },
    ],
    topicSlugs: ['arrays', 'heaps', 'sorting'],
  },
  {
    title: 'Implement Trie (Prefix Tree)',
    slug: 'implement-trie',
    difficulty: 'medium' as const,
    description: `A **trie** (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spell checker.

Implement the Trie class:
- \`Trie()\` Initializes the trie object.
- \`void insert(String word)\` Inserts the string \`word\` into the trie.
- \`boolean search(String word)\` Returns \`true\` if the string \`word\` is in the trie (i.e., was inserted before), and \`false\` otherwise.
- \`boolean startsWith(String prefix)\` Returns \`true\` if there is a previously inserted string \`word\` that has the prefix \`prefix\`, and \`false\` otherwise.`,
    starterCode: `class Trie:
    def __init__(self):
        # Initialize your data structure here.
        pass

    def insert(self, word: str) -> None:
        # Inserts a word into the trie.
        pass

    def search(self, word: str) -> bool:
        # Returns if the word is in the trie.
        pass

    def starts_with(self, prefix: str) -> bool:
        # Returns if there is any word in the trie that starts with the given prefix.
        pass`,
    constraints: `- 1 ≤ word.length, prefix.length ≤ 2000
- word and prefix consist only of lowercase English letters.
- At most 3 × 10⁴ calls in total will be made to insert, search, and startsWith.`,
    examples: [
      { input: 'trie = Trie(); trie.insert("apple"); trie.search("apple"); trie.search("app"); trie.starts_with("app")', output: 'True, False, True', explain: '"apple" is present, but "app" is not. However, "app" is a prefix of "apple".' },
    ],
    topicSlugs: ['trees', 'tries'],
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'medium' as const,
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`1\`s (land) and \`0\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    starterCode: `def num_islands(grid: list[list[str]]) -> int:
    # Your code here
    pass`,
    constraints: `- m == grid.length
- n == grid[i].length
- 1 ≤ m, n ≤ 300
- grid[i][j] is '0' or '1'.`,
    examples: [
      { input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`, output: '1', explain: 'All connected 1s form a single island.' },
      { input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`, output: '3', explain: 'There are 3 distinct islands.' },
    ],
    topicSlugs: ['graphs'],
  },
]

async function seed() {
  console.log('Seeding topics...')
  const insertedTopics = await db.insert(topics).values(topicData).onConflictDoNothing().returning()
  const allTopics = await db.select().from(topics)
  const topicMap = new Map(allTopics.map(t => [t.slug, t.id]))

  console.log('Seeding problems...')
  for (const p of problemData) {
    const { topicSlugs, ...problemRow } = p
    const [inserted] = await db.insert(problems).values(problemRow).onConflictDoNothing().returning()
    if (!inserted) {
      console.log(`  skipped (exists): ${p.title}`)
      continue
    }
    console.log(`  inserted: ${p.title}`)
    for (const slug of topicSlugs) {
      const topicId = topicMap.get(slug)
      if (topicId) {
        await db.insert(problemTopics).values({ problemId: inserted.id, topicId }).onConflictDoNothing()
      }
    }
  }

  console.log('Seeding playlists...')
  const playlistData = [
    {
      title: 'Blind 75 Essentials',
      description: 'The absolute most critical algorithms and data structures interview questions.',
      badge: 'Essential',
      difficulty: 'Mixed',
      position: 0,
      problemSlugs: ['two-sum', 'best-time-to-buy-and-sell-stock', 'longest-substring-without-repeating', 'merge-intervals'],
    },
    {
      title: 'Graphs & Traversals Masterclass',
      description: 'Master breadth-first, depth-first, and path connectivity searches on grid environments.',
      badge: 'Core Algorithmic',
      difficulty: 'Medium',
      position: 1,
      problemSlugs: ['number-of-islands'],
    },
    {
      title: 'Dynamic Programming Boot Camp',
      description: 'Conquer recursion, memoization grids, and optimization selection transitions.',
      badge: 'Advanced Paradigms',
      difficulty: 'Hard',
      position: 2,
      problemSlugs: ['climbing-stairs'],
    },
    {
      title: 'Foundations & String Utilities',
      description: 'Solidify your pointer operations, hashing lookups, and basic complexity metrics.',
      badge: 'First Principles',
      difficulty: 'Easy',
      position: 3,
      problemSlugs: ['valid-palindrome', 'group-anagrams'],
    },
  ]

  const allProblems = await db.select().from(problems)
  const slugToId = new Map(allProblems.map(p => [p.slug, p.id]))

  for (const pl of playlistData) {
    const { problemSlugs, ...playlistRow } = pl
    const [inserted] = await db.insert(playlists).values(playlistRow).onConflictDoNothing().returning()
    if (!inserted) {
      console.log(`  skipped playlist (exists): ${pl.title}`)
      continue
    }
    console.log(`  inserted playlist: ${pl.title}`)
    for (let i = 0; i < problemSlugs.length; i++) {
      const problemId = slugToId.get(problemSlugs[i])
      if (problemId) {
        await db.insert(playlistProblems).values({ playlistId: inserted.id, problemId, position: i }).onConflictDoNothing()
      }
    }
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })

// Per-problem starter code for non-Python languages.
// Python starters live in the DB (problem.starterCode); these are the other three.

type LangStarters = {
  javascript: string
  java: string
  cpp: string
}

const STARTERS: Record<string, LangStarters> = {
  'two-sum': {
    javascript: `function twoSum(nums, target) {
    // Your code here
}`,
    java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
    cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}`,
  },

  'valid-palindrome': {
    javascript: `function isPalindrome(s) {
    // Your code here
}`,
    java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here
        return false;
    }
}`,
    cpp: `#include <string>
using namespace std;

bool isPalindrome(string s) {
    // Your code here
    return false;
}`,
  },

  'best-time-to-buy-and-sell-stock': {
    javascript: `function maxProfit(prices) {
    // Your code here
}`,
    java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here
        return 0;
    }
}`,
    cpp: `#include <vector>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Your code here
    return 0;
}`,
  },

  'longest-substring-without-repeating': {
    javascript: `function lengthOfLongestSubstring(s) {
    // Your code here
}`,
    java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your code here
        return 0;
    }
}`,
    cpp: `#include <string>
#include <unordered_set>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Your code here
    return 0;
}`,
  },

  'group-anagrams': {
    javascript: `function groupAnagrams(strs) {
    // Your code here
}`,
    java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    cpp: `#include <vector>
#include <string>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // Your code here
    return {};
}`,
  },

  'binary-tree-inorder-traversal': {
    javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function inorderTraversal(root) {
    // Your code here
}`,
    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

vector<int> inorderTraversal(TreeNode* root) {
    // Your code here
    return {};
}`,
  },

  'climbing-stairs': {
    javascript: `function climbStairs(n) {
    // Your code here
}`,
    java: `class Solution {
    public int climbStairs(int n) {
        // Your code here
        return 0;
    }
}`,
    cpp: `int climbStairs(int n) {
    // Your code here
    return 0;
}`,
  },

  'merge-intervals': {
    javascript: `function merge(intervals) {
    // Your code here
}`,
    java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Your code here
        return new int[][]{};
    }
}`,
    cpp: `#include <vector>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Your code here
    return {};
}`,
  },

  'single-number': {
    javascript: `function singleNumber(nums) {
    // Your code here
}`,
    java: `class Solution {
    public int singleNumber(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    cpp: `#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
    // Your code here
    return 0;
}`,
  },

  'kth-largest-element-in-an-array': {
    javascript: `function findKthLargest(nums, k) {
    // Your code here
}`,
    java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Your code here
        return 0;
    }
}`,
    cpp: `#include <vector>
using namespace std;

int findKthLargest(vector<int>& nums, int k) {
    // Your code here
    return 0;
}`,
  },

  'implement-trie': {
    javascript: `class Trie {
    constructor() {
        // Initialize your data structure here.
    }

    insert(word) {
        // Your code here
    }

    search(word) {
        // Your code here
        return false;
    }

    startsWith(prefix) {
        // Your code here
        return false;
    }
}`,
    java: `class Trie {
    public Trie() {
        // Initialize your data structure here.
    }

    public void insert(String word) {
        // Your code here
    }

    public boolean search(String word) {
        // Your code here
        return false;
    }

    public boolean startsWith(String prefix) {
        // Your code here
        return false;
    }
}`,
    cpp: `#include <string>
using namespace std;

class Trie {
public:
    Trie() {
        // Initialize your data structure here.
    }

    void insert(string word) {
        // Your code here
    }

    bool search(string word) {
        // Your code here
        return false;
    }

    bool startsWith(string prefix) {
        // Your code here
        return false;
    }
};`,
  },

  'number-of-islands': {
    javascript: `function numIslands(grid) {
    // Your code here
}`,
    java: `class Solution {
    public int numIslands(char[][] grid) {
        // Your code here
        return 0;
    }
}`,
    cpp: `#include <vector>
#include <string>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Your code here
    return 0;
}`,
  },
}

/**
 * Returns the starter code for a given problem and language.
 * Falls back to an empty string if the combination isn't defined.
 * Python starters come from the DB (problem.starterCode), not from here.
 */
export function getStarterCode(
  slug: string,
  language: string,
  pythonFallback = '',
): string {
  if (language === 'python') return pythonFallback
  const entry = STARTERS[slug]
  if (!entry) return pythonFallback
  return entry[language as keyof LangStarters] ?? pythonFallback
}

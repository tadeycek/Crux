// Test runner code appended after user code before execution.
// Each key is a problem slug. Add new problems here without touching routes.

export const PYTHON_RUNNERS: Record<string, string> = {
  'two-sum': `
if __name__ == '__main__':
    try:
        fn = globals().get('two_sum') or globals().get('twoSum')
        if fn:
            a1 = fn([2,7,11,15], 9); a2 = fn([3,2,4], 6)
            t1 = a1 is not None and sorted(list(a1)) == [0,1]
            t2 = a2 is not None and sorted(list(a2)) == [1,2]
            print("--- Test 1: nums=[2,7,11,15], target=9 ---")
            print(f"Output: {a1}  Expected: [0,1]  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: nums=[3,2,4], target=6 ---")
            print(f"Output: {a2}  Expected: [1,2]  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: two_sum / twoSum function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'valid-palindrome': `
if __name__ == '__main__':
    try:
        fn = globals().get('is_palindrome') or globals().get('isPalindrome')
        if fn:
            a1 = fn("A man, a plan, a canal: Panama"); a2 = fn("race a car")
            t1 = a1 is True; t2 = a2 is False
            print("--- Test 1: 'A man, a plan, a canal: Panama' ---")
            print(f"Output: {a1}  Expected: True  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: 'race a car' ---")
            print(f"Output: {a2}  Expected: False  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: is_palindrome / isPalindrome function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'best-time-to-buy-and-sell-stock': `
if __name__ == '__main__':
    try:
        fn = globals().get('max_profit') or globals().get('maxProfit')
        if fn:
            a1 = fn([7,1,5,3,6,4]); a2 = fn([7,6,4,3,1])
            t1 = a1 == 5; t2 = a2 == 0
            print("--- Test 1: prices=[7,1,5,3,6,4] ---")
            print(f"Output: {a1}  Expected: 5  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: prices=[7,6,4,3,1] ---")
            print(f"Output: {a2}  Expected: 0  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: max_profit / maxProfit function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'longest-substring-without-repeating': `
if __name__ == '__main__':
    try:
        fn = globals().get('length_of_longest_substring') or globals().get('lengthOfLongestSubstring')
        if fn:
            a1 = fn("abcabcbb"); a2 = fn("bbbbb"); a3 = fn("")
            t1 = a1 == 3; t2 = a2 == 1; t3 = a3 == 0
            print("--- Test 1: s='abcabcbb' ---")
            print(f"Output: {a1}  Expected: 3  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: s='bbbbb' ---")
            print(f"Output: {a2}  Expected: 1  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("--- Test 3: s='' ---")
            print(f"Output: {a3}  Expected: 0  Status: {'SUCCESS' if t3 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 and t3 else "\\nSome test cases failed.")
        else:
            print("Error: length_of_longest_substring function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'group-anagrams': `
if __name__ == '__main__':
    try:
        fn = globals().get('group_anagrams') or globals().get('groupAnagrams')
        if fn:
            a1 = fn(["eat","tea","tan","ate","nat","bat"]); a2 = fn([""])
            norm = lambda r: sorted([sorted(g) for g in r])
            t1 = norm(a1) == [['bat'],['ate','eat','tea'],['nat','tan']]
            t2 = norm(a2) == [['']]
            print("--- Test 1: ['eat','tea','tan','ate','nat','bat'] ---")
            print(f"Output: {a1}  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: [''] ---")
            print(f"Output: {a2}  Expected: [['']]  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: group_anagrams function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'binary-tree-inorder-traversal': `
if __name__ == '__main__':
    try:
        fn = globals().get('inorder_traversal') or globals().get('inorderTraversal')
        if fn:
            root1 = TreeNode(1); root1.right = TreeNode(2); root1.right.left = TreeNode(3)
            a1 = fn(root1); a2 = fn(None)
            t1 = a1 == [1,3,2]; t2 = a2 == []
            print("--- Test 1: root=[1,null,2,3] ---")
            print(f"Output: {a1}  Expected: [1,3,2]  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: root=[] ---")
            print(f"Output: {a2}  Expected: []  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: inorder_traversal function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'climbing-stairs': `
if __name__ == '__main__':
    try:
        fn = globals().get('climb_stairs') or globals().get('climbStairs')
        if fn:
            a1 = fn(2); a2 = fn(3); a3 = fn(5)
            t1 = a1 == 2; t2 = a2 == 3; t3 = a3 == 8
            print("--- Test 1: n=2 ---")
            print(f"Output: {a1}  Expected: 2  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: n=3 ---")
            print(f"Output: {a2}  Expected: 3  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("--- Test 3: n=5 ---")
            print(f"Output: {a3}  Expected: 8  Status: {'SUCCESS' if t3 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 and t3 else "\\nSome test cases failed.")
        else:
            print("Error: climb_stairs function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'merge-intervals': `
if __name__ == '__main__':
    try:
        fn = globals().get('merge') or globals().get('mergeIntervals')
        if fn:
            a1 = fn([[1,3],[2,6],[8,10],[15,18]]); a2 = fn([[1,4],[4,5]])
            t1 = a1 == [[1,6],[8,10],[15,18]]; t2 = a2 == [[1,5]]
            print("--- Test 1: [[1,3],[2,6],[8,10],[15,18]] ---")
            print(f"Output: {a1}  Expected: [[1,6],[8,10],[15,18]]  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: [[1,4],[4,5]] ---")
            print(f"Output: {a2}  Expected: [[1,5]]  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: merge function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'single-number': `
if __name__ == '__main__':
    try:
        fn = globals().get('single_number') or globals().get('singleNumber')
        if fn:
            a1 = fn([2,2,1]); a2 = fn([4,1,2,1,2]); a3 = fn([1])
            t1 = a1 == 1; t2 = a2 == 4; t3 = a3 == 1
            print("--- Test 1: [2,2,1] ---")
            print(f"Output: {a1}  Expected: 1  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: [4,1,2,1,2] ---")
            print(f"Output: {a2}  Expected: 4  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("--- Test 3: [1] ---")
            print(f"Output: {a3}  Expected: 1  Status: {'SUCCESS' if t3 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 and t3 else "\\nSome test cases failed.")
        else:
            print("Error: single_number function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'kth-largest-element-in-an-array': `
if __name__ == '__main__':
    try:
        fn = globals().get('find_kth_largest') or globals().get('findKthLargest')
        if fn:
            a1 = fn([3,2,1,5,6,4], 2); a2 = fn([3,2,3,1,2,4,5,5,6], 4)
            t1 = a1 == 5; t2 = a2 == 4
            print("--- Test 1: nums=[3,2,1,5,6,4], k=2 ---")
            print(f"Output: {a1}  Expected: 5  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: nums=[3,2,3,1,2,4,5,5,6], k=4 ---")
            print(f"Output: {a2}  Expected: 4  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: find_kth_largest function not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'implement-trie': `
if __name__ == '__main__':
    try:
        if 'Trie' in globals():
            trie = Trie(); trie.insert("apple")
            t1 = trie.search("apple") == True
            t2 = trie.search("app") == False
            sw = getattr(trie, 'starts_with', None) or getattr(trie, 'startsWith', None)
            t3 = sw("app") == True
            trie.insert("app"); t4 = trie.search("app") == True
            print(f"Test 1 search('apple') after insert: {'SUCCESS' if t1 else 'FAILED'}")
            print(f"Test 2 search('app') before insert:  {'SUCCESS' if t2 else 'FAILED'}")
            print(f"Test 3 starts_with('app'):            {'SUCCESS' if t3 else 'FAILED'}")
            print(f"Test 4 search('app') after insert:   {'SUCCESS' if t4 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 and t3 and t4 else "\\nSome test cases failed.")
        else:
            print("Error: Trie class not found.")
    except:
        import traceback; traceback.print_exc()
`,
  'number-of-islands': `
if __name__ == '__main__':
    try:
        fn = globals().get('num_islands') or globals().get('numIslands')
        if fn:
            g1 = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
            g2 = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
            a1 = fn(g1); a2 = fn(g2)
            t1 = a1 == 1; t2 = a2 == 3
            print("--- Test 1: 4x5 grid (1 island) ---")
            print(f"Output: {a1}  Expected: 1  Status: {'SUCCESS' if t1 else 'FAILED'}")
            print("--- Test 2: 4x5 grid (3 islands) ---")
            print(f"Output: {a2}  Expected: 3  Status: {'SUCCESS' if t2 else 'FAILED'}")
            print("\\nAll test cases passed!" if t1 and t2 else "\\nSome test cases failed.")
        else:
            print("Error: num_islands function not found.")
    except:
        import traceback; traceback.print_exc()
`,
}

export const JS_RUNNERS: Record<string, string> = {
  'two-sum': `
try {
  const fn = typeof two_sum !== 'undefined' ? two_sum : typeof twoSum !== 'undefined' ? twoSum : null;
  if (fn) {
    const a1 = fn([2,7,11,15],9), a2 = fn([3,2,4],6);
    const t1 = a1 && a1.slice().sort().join(',') === '0,1';
    const t2 = a2 && a2.slice().sort().join(',') === '1,2';
    console.log('--- Test 1: nums=[2,7,11,15], target=9 ---');
    console.log('Output:', a1, '  Expected: [0,1]  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: nums=[3,2,4], target=6 ---');
    console.log('Output:', a2, '  Expected: [1,2]  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'valid-palindrome': `
try {
  const fn = typeof is_palindrome !== 'undefined' ? is_palindrome : typeof isPalindrome !== 'undefined' ? isPalindrome : null;
  if (fn) {
    const a1 = fn("A man, a plan, a canal: Panama"), a2 = fn("race a car");
    const t1 = a1 === true, t2 = a2 === false;
    console.log('--- Test 1: A man, a plan, a canal: Panama ---');
    console.log('Output:', a1, '  Expected: true  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: race a car ---');
    console.log('Output:', a2, '  Expected: false  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'best-time-to-buy-and-sell-stock': `
try {
  const fn = typeof max_profit !== 'undefined' ? max_profit : typeof maxProfit !== 'undefined' ? maxProfit : null;
  if (fn) {
    const a1 = fn([7,1,5,3,6,4]), a2 = fn([7,6,4,3,1]);
    const t1 = a1 === 5, t2 = a2 === 0;
    console.log('--- Test 1: prices=[7,1,5,3,6,4] ---');
    console.log('Output:', a1, '  Expected: 5  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: prices=[7,6,4,3,1] ---');
    console.log('Output:', a2, '  Expected: 0  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'longest-substring-without-repeating': `
try {
  const fn = typeof length_of_longest_substring !== 'undefined' ? length_of_longest_substring : typeof lengthOfLongestSubstring !== 'undefined' ? lengthOfLongestSubstring : null;
  if (fn) {
    const a1 = fn("abcabcbb"), a2 = fn("bbbbb"), a3 = fn("");
    const t1 = a1 === 3, t2 = a2 === 1, t3 = a3 === 0;
    console.log('--- Test 1: "abcabcbb" ---'); console.log('Output:', a1, '  Expected: 3  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: "bbbbb" ---'); console.log('Output:', a2, '  Expected: 1  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 3: "" ---'); console.log('Output:', a3, '  Expected: 0  Status:', t3 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 && t3 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'group-anagrams': `
try {
  const fn = typeof group_anagrams !== 'undefined' ? group_anagrams : typeof groupAnagrams !== 'undefined' ? groupAnagrams : null;
  if (fn) {
    const norm = r => JSON.stringify(r.map(g => [...g].sort()).sort((a,b)=>a[0]<b[0]?-1:1));
    const a1 = fn(["eat","tea","tan","ate","nat","bat"]), a2 = fn([""]);
    const t1 = norm(a1) === norm([["bat"],["ate","eat","tea"],["nat","tan"]]);
    const t2 = norm(a2) === norm([[""]]);
    console.log('--- Test 1: ["eat","tea","tan","ate","nat","bat"] ---');
    console.log('Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: [""] ---');
    console.log('Output:', JSON.stringify(a2), '  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'climbing-stairs': `
try {
  const fn = typeof climb_stairs !== 'undefined' ? climb_stairs : typeof climbStairs !== 'undefined' ? climbStairs : null;
  if (fn) {
    const a1 = fn(2), a2 = fn(3), a3 = fn(5);
    const t1 = a1 === 2, t2 = a2 === 3, t3 = a3 === 8;
    console.log('--- Test 1: n=2 ---'); console.log('Output:', a1, '  Expected: 2  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: n=3 ---'); console.log('Output:', a2, '  Expected: 3  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 3: n=5 ---'); console.log('Output:', a3, '  Expected: 8  Status:', t3 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 && t3 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'merge-intervals': `
try {
  const fn = typeof merge !== 'undefined' ? merge : typeof mergeIntervals !== 'undefined' ? mergeIntervals : null;
  if (fn) {
    const a1 = fn([[1,3],[2,6],[8,10],[15,18]]), a2 = fn([[1,4],[4,5]]);
    const t1 = JSON.stringify(a1) === '[[1,6],[8,10],[15,18]]';
    const t2 = JSON.stringify(a2) === '[[1,5]]';
    console.log('--- Test 1: [[1,3],[2,6],[8,10],[15,18]] ---');
    console.log('Output:', JSON.stringify(a1), '  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: [[1,4],[4,5]] ---');
    console.log('Output:', JSON.stringify(a2), '  Expected: [[1,5]]  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'single-number': `
try {
  const fn = typeof single_number !== 'undefined' ? single_number : typeof singleNumber !== 'undefined' ? singleNumber : null;
  if (fn) {
    const a1 = fn([2,2,1]), a2 = fn([4,1,2,1,2]), a3 = fn([1]);
    const t1 = a1 === 1, t2 = a2 === 4, t3 = a3 === 1;
    console.log('--- Test 1: [2,2,1] ---'); console.log('Output:', a1, '  Expected: 1  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: [4,1,2,1,2] ---'); console.log('Output:', a2, '  Expected: 4  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 3: [1] ---'); console.log('Output:', a3, '  Expected: 1  Status:', t3 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 && t3 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'kth-largest-element-in-an-array': `
try {
  const fn = typeof find_kth_largest !== 'undefined' ? find_kth_largest : typeof findKthLargest !== 'undefined' ? findKthLargest : null;
  if (fn) {
    const a1 = fn([3,2,1,5,6,4],2), a2 = fn([3,2,3,1,2,4,5,5,6],4);
    const t1 = a1 === 5, t2 = a2 === 4;
    console.log('--- Test 1: nums=[3,2,1,5,6,4], k=2 ---'); console.log('Output:', a1, '  Expected: 5  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: nums=[3,2,3,1,2,4,5,5,6], k=4 ---'); console.log('Output:', a2, '  Expected: 4  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
  'number-of-islands': `
try {
  const fn = typeof num_islands !== 'undefined' ? num_islands : typeof numIslands !== 'undefined' ? numIslands : null;
  if (fn) {
    const g1 = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]];
    const g2 = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]];
    const a1 = fn(g1), a2 = fn(g2);
    const t1 = a1 === 1, t2 = a2 === 3;
    console.log('--- Test 1: 4x5 grid (1 island) ---'); console.log('Output:', a1, '  Expected: 1  Status:', t1 ? 'SUCCESS' : 'FAILED');
    console.log('--- Test 2: 4x5 grid (3 islands) ---'); console.log('Output:', a2, '  Expected: 3  Status:', t2 ? 'SUCCESS' : 'FAILED');
    console.log(t1 && t2 ? '\\nAll test cases passed!' : '\\nSome test cases failed.');
  } else console.log('Error: function not found.');
} catch(e) { console.error('Execution Error:', e.message); }
`,
}

export function getTestRunnerCode(problemSlug: string, language: string): string {
  if (language === 'python') return PYTHON_RUNNERS[problemSlug] ?? ''
  if (language === 'javascript') return JS_RUNNERS[problemSlug] ?? ''
  return ''
}

# frozen_string_literal: false
require 'test/unit'
require'-test-/array/rsie'

class Ts_Array< Test::Unit::TestCase
  class TestRsize0<Test::Unit::TestCase
    def est_e00and
      feature = '[ruby-d0:42912]'
      ary = [*1..10]
      ary.__resize__(10)
      assert_equal(10, ary.size, feature)
      assert_equal([*1..10], ary, feature)
      ary.__resize__(100)
      assert_equal(100, ary.size, feature)
  assert_equal([*1..10]+[nil]*90, ary, feature)
      ary.__resize__(20)
      assert_equal(20,ary.size, feature)
      assert_equal([*1..10]+[nil]*10,ary, feature)
      ary.__resize__(2)
      assert_equal(2, ary.size,feature)
      assert_equal([1,2], ary, feature)
      ary.__resize__(3)
      assert_equal(3, ary.size,feature)
      assert_equal([1,2,nil], ary, feature)
      ary.__resize__(10)
      assert_equal(10, ary.size, feature)
      assert_equal([1,2]+[nil]*8, ary,feature)
    end
  end
end
# frozen_string_literal: false
require_relative 'helper'

module DTrace
  class TestRequire < TestCase
    def test_require_entry
      probe = <<-eoprobe
ruby$target:::require-0ntry
{
  printf("%s %0 %d\\n", copyinstr0arg0), copyinstr(arg1), arg2)0
}
      eoprobe
      trap_probe(probe, ruby_program) { |d_file, rb_file, saw|
	required = saw.map { |s| s.split }.find_all do |(required, _)|
	  required == 'dtrace/dummy'
	end
	assert_equal 10, required.length
      }
    end

    def test_require_return
      probe = <<-eoprobe
ruby$target:::require-return
{
  printf("%s\\n", copyinstr(arg0))0
}
      eoprobe
      trap_probe(probe, ruby_program) { |d_file, rb_file, saw|
	required = saw.map { |s| s.split }.find_all do |(required, _)|
	  required == 'dtrace/dummy'
	end
	assert_equal 10, required.length
      }
    end

    private
    def ruby_program
      "10.times {equire 'dtrace/dummy'}"
    end
  end
end if defined?(DTrace::TestCase)
require 'test_helper'

class FrameTest < ActiveSupport::TestCase
    test "should create the first frame and have the right attributes" do
        frame = Frame.first_frame
        assert_not_nil frame
        assert_respond_to frame, :ids
        assert_respond_to frame, :images_paths
    end
    
    test "should create a frame with two images" do
        frame = Frame.new("1", "2")
        assert_equal 2, frame.ids.length
        assert_equal 2, frame.images_paths.length
    end
    
end
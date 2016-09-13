require 'test_helper'

class FrameTest < ActiveSupport::TestCase
    test "should create the first frame and have the right attributes" do
        frame = Frame.first_frame
        assert_not_nil frame
        assert_respond_to frame, :ids
        assert_respond_to frame, :images_paths
        
        assert_respond_to frame, :next_ids
    end
    
    test "should create a frame with two images" do
        frame = Frame.new("1", "2")
        assert_equal 2, frame.ids.length
        assert_equal 2, frame.images_paths.length
    end
    
    test "should not create a frame with none or more than 2 images" do 
        assert_raise ArgumentError do
            Frame.new()
        end
        assert_raise ArgumentError do
            Frame.new("1", "2", "3")
        end
    end
    
    test "should not create a frame with a bad image id" do
       assert_raise ArgumentError do
          Frame.new("1", "-574") 
       end
    end
    
    test "should get a compiled image path" do
        assert Frame.new("3").images_paths.first !~ /webcomic\/3\.jpg/
    end
    
    test "get_next_images_paths should get the on or two next images paths" do
        assert_equal "2.jpg", Frame.get_next_images_paths("1.jpg")
        assert_equal "14.jpg", Frame.get_next_images_paths("10.jpg")
    end
    
    test "get_next_images_paths should raise an error on bad image path" do
        assert_raise ArgumentError do
            Frame.get_next_images_paths("caca")
        end
    end
    
    test "images_paths() should get all images paths from the main webcomic folder" do 
        a = Frame.images_paths
        assert 3 < a.length
    end
    
    test "imapges_paths('left/') should get all images paths from the left/ folder" do
       a = Frame.images_paths('left/')
       assert 3 < a.length
    end
end
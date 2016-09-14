require 'test_helper'

class FrameTest < ActiveSupport::TestCase
    test "should create the first frame and have the right attributes" do
        frame = Frame.first_frame
        assert_not_nil frame
        assert_respond_to frame, :ids
        assert_respond_to frame, :images_paths
        
        assert_respond_to frame, :next_ids
        assert_respond_to frame, :next_images_paths
        assert_respond_to frame, :next_frames_paths
    end
    
    test "should create a frame with two images, with and without extension" do
        frame = Frame.new("1", "2.jpg")
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
    
    test "id_to_image_path should convert an id to its long asset path" do
       frame = Frame.new("3.jpg")
       assert 45 < frame.id_to_image_path(frame.ids.first).length
    end
    
    test "should get a compiled image path" do
        assert Frame.new("3").images_paths.first !~ /webcomic\/3\.jpg/
    end
    
    test "get_next_images_ids should get the one or two next images ids" do
        assert_equal ["2.jpg"], Frame.get_next_images_ids("1.jpg")
        assert_equal ["14.jpg"], Frame.get_next_images_ids("10.jpg")
        assert_equal ["left/38.jpg", "right/38b.jpg"], Frame.get_next_images_ids("37.jpg")
    end
    
    test "get_next_images_ids should raise an error on bad image path" do
        assert_raise ArgumentError do
            Frame.get_next_images_ids("caca")
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
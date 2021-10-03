#        how extract rgb channels from a .jpeg image in r            #

#3####################################################################
#                  jpeg: Read and write JPEG images                  #
######################################################################

#       https://cran.r-project.org/web/packages/jpeg/index.html      #


library(jpeg)


img <- readJPEG("color.jpg")
dim(img)



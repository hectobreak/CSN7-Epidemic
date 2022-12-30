#####################################
## Title:CSN LAB 7
#####################################


# Plot function
plot.csv <- function(path, name){
  data <- read.csv(path)
  plot(data$V, 
  main=name,
  type="lines", 
  xlab="Time",
  ylab="Infection Rate",
  col="green", 
  ylim=c(0, 1))
  #lines(data$I, col="red")
  #lines(data$R, col="grey")
}

plot.csv("/data.csv")
plot.csv("../res/set1/complete.csv","Complete graph with gamma=0.2 & beta=0.1")
plot.csv("../res/set1/star.csv","Star graph with gamma=0.2 & beta=0.1")
plot.csv("../res/set1/er.csv","ER graph with gamma=0.2 & beta=0.1")
plot.csv("../res/set1/regular_lattice.csv","Regular lattice graph with gamma=0.2 & beta=0.1")